from flask import Blueprint, request, jsonify, session
from models.models import Issue, Category, Location, User, Vote, Comment, db
from datetime import datetime

issues_api_bp = Blueprint('issues_api', __name__)

def get_current_user():
    user_id = session.get('user_id')
    if user_id:
        return User.query.get(user_id)
    return None

@issues_api_bp.route('/', methods=['GET'])
@issues_api_bp.route('', methods=['GET'])
def get_issues():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category_id = request.args.get('category_id', type=int)
        location_id = request.args.get('location_id', type=int)
        status = request.args.get('status')
        search = request.args.get('search')
        
        query = Issue.query
        
        # Apply filters
        if category_id:
            query = query.filter(Issue.category_id == category_id)
        if location_id:
            query = query.filter(Issue.location_id == location_id)
        if status:
            query = query.filter(Issue.status == status)
        if search:
            query = query.filter(Issue.title.contains(search) | Issue.description.contains(search))
        
        # Order by creation date (newest first)
        query = query.order_by(Issue.created_at.desc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=per_page)
        issues = pagination.items
        
        return jsonify({
            'issues': [issue.to_dict() for issue in issues],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@issues_api_bp.route('/', methods=['POST'])
@issues_api_bp.route('', methods=['POST'])
def create_issue():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'category_id', 'location_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create new issue
        issue = Issue(
            title=data['title'],
            description=data['description'],
            user_id=user.id,
            category_id=data['category_id'],
            location_id=data['location_id'],
            priority=data.get('severity', 'medium'),  # Map severity to priority
            address=data.get('address'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            media_urls=data.get('media_urls', [])
        )
        
        db.session.add(issue)
        db.session.commit()
        
        return jsonify({
            'message': 'Issue created successfully',
            'issue': issue.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@issues_api_bp.route('/<int:issue_id>', methods=['GET'])
def get_issue(issue_id):
    try:
        issue = Issue.query.get_or_404(issue_id)
        
        # Increment view count
        issue.views += 1
        db.session.commit()
        
        return jsonify({'issue': issue.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@issues_api_bp.route('/<int:issue_id>/vote', methods=['POST'])
def vote_issue(issue_id):
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        data = request.get_json()
        vote_type = data.get('vote_type')  # 'up' or 'down'
        
        if vote_type not in ['up', 'down']:
            return jsonify({'error': 'Invalid vote type'}), 400
        
        issue = Issue.query.get_or_404(issue_id)
        
        # Check if user already voted
        existing_vote = Vote.query.filter_by(user_id=user.id, issue_id=issue_id).first()
        
        if existing_vote:
            # Update existing vote
            if existing_vote.vote_type == vote_type:
                # Remove vote if same type
                db.session.delete(existing_vote)
                if vote_type == 'up':
                    issue.upvotes -= 1
                else:
                    issue.downvotes -= 1
            else:
                # Change vote type
                existing_vote.vote_type = vote_type
                if vote_type == 'up':
                    issue.upvotes += 1
                    issue.downvotes -= 1
                else:
                    issue.downvotes += 1
                    issue.upvotes -= 1
        else:
            # Create new vote
            vote = Vote(user_id=user.id, issue_id=issue_id, vote_type=vote_type)
            db.session.add(vote)
            if vote_type == 'up':
                issue.upvotes += 1
            else:
                issue.downvotes += 1
        
        db.session.commit()
        
        return jsonify({
            'message': 'Vote recorded successfully',
            'upvotes': issue.upvotes,
            'downvotes': issue.downvotes
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@issues_api_bp.route('/<int:issue_id>/comments', methods=['GET'])
def get_comments(issue_id):
    try:
        issue = Issue.query.get_or_404(issue_id)
        comments = Comment.query.filter_by(issue_id=issue_id, parent_id=None).order_by(Comment.created_at.desc()).all()
        
        return jsonify({
            'comments': [comment.to_dict() for comment in comments]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@issues_api_bp.route('/<int:issue_id>/comments', methods=['POST'])
def add_comment(issue_id):
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        data = request.get_json()
        content = data.get('content')
        
        if not content:
            return jsonify({'error': 'Comment content is required'}), 400
        
        issue = Issue.query.get_or_404(issue_id)
        
        comment = Comment(
            content=content,
            user_id=user.id,
            issue_id=issue_id,
            parent_id=data.get('parent_id')
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify({
            'message': 'Comment added successfully',
            'comment': comment.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@issues_api_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify({
            'categories': [category.to_dict() for category in categories]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
