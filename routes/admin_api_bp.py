from flask import Blueprint
from flask import jsonify
from sqlalchemy import func, case
from datetime import datetime, timedelta
from models.models import db, Issue, User, Category


admin_api_bp = Blueprint('admin_api', __name__)

@admin_api_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # Total counts
        total_issues = db.session.query(func.count(Issue.id)).scalar()
        total_users = db.session.query(func.count(User.id)).scalar()

        # Issue counts by status
        status_counts = db.session.query(
            func.count(case((Issue.status == 'open', Issue.id))),
            func.count(case((Issue.status == 'in_progress', Issue.id))),
            func.count(case((Issue.status == 'resolved', Issue.id)))
        ).one()

        # Issues reported in the last 7 days (for "upload rate")
        one_week_ago = datetime.utcnow() - timedelta(days=7)
        issues_last_7_days = db.session.query(func.count(Issue.id)).filter(Issue.created_at >= one_week_ago).scalar()

        # Top 5 categories with the most issues
        top_categories_query = db.session.query(
            Issue.category_id,
            func.count(Issue.id).label('issue_count')
        ).group_by(Issue.category_id).order_by(func.count(Issue.id).desc()).limit(5).all()
        
        # We need to fetch category names for the IDs
        top_categories = []
        for category_id, count in top_categories_query:
            category = db.session.query(Category).get(category_id)
            if category:
                top_categories.append({'name': category.name, 'count': count})


        stats = {
            'totalIssues': total_issues,
            'totalUsers': total_users,
            'openIssues': status_counts[0],
            'inProgressIssues': status_counts[1],
            'resolvedIssues': status_counts[2],
            'issuesLast7Days': issues_last_7_days,
            'topCategories': top_categories
        }

        return jsonify(stats), 200

    except Exception as e:
        print(f"Error in get_dashboard_stats: {e}")
        return jsonify({'error': str(e)}), 500