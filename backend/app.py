from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Issue, Location
import uuid
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost/sunoaid')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)

# CORS configuration
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
CORS(app, supports_credentials=True, origins=cors_origins)

# Simple in-memory store for active sessions (simplified)
active_sessions = {}



# --- Auth Routes ---

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400

        # Create new user (no password hashing as requested)
        user = User(name=name, email=email, password=password)
        db.session.add(user)
        db.session.commit()

        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Find user by email
        user = User.query.filter_by(email=email).first()

        # Check if user exists and password matches (no hashing)
        if user and user.password == password:
            # Create a simple session token
            session_token = str(uuid.uuid4())
            active_sessions[session_token] = user.id
            
            return jsonify({
                'message': 'Login successful',
                'token': session_token,
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/api/logout', methods=['POST'])
def logout():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        active_sessions.pop(token, None)
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/user', methods=['GET'])
def get_current_user():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        user_id = active_sessions.get(token)
        if user_id:
            user = User.query.get(user_id)
            if user:
                return jsonify({
                    'user': {
                        'id': user.id,
                        'name': user.name,
                        'email': user.email
                    }
                }), 200
    return jsonify({'error': 'Not authenticated'}), 401







# --- Issue Routes ---

@app.route('/api/issues', methods=['GET'])
def get_issues():
    try:
        issues = Issue.query.all()
        issues_data = []
        for issue in issues:
            issue_data = {
                'id': issue.id,
                'title': issue.title,
                'description': issue.description,
                'status': issue.status,
                'severity': issue.severity,
                'category': issue.category,
                'location': {
                    'id': issue.location.id,
                    'latitude': issue.location.latitude,
                    'longitude': issue.location.longitude,
                    'address': issue.location.address,
                    'city': issue.location.city,
                    'province': issue.location.province
                } if issue.location else None,
                'user': {
                    'id': issue.user.id,
                    'name': issue.user.name
                } if issue.user else None
            }
            issues_data.append(issue_data)
        
        return jsonify({'issues': issues_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/issues', methods=['POST'])
def create_issue():
    try:
        # Check authentication
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authentication required'}), 401
            
        token = auth_header.split(' ')[1]
        user_id = active_sessions.get(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
            
        data = request.get_json()
        print(f"Creating issue with data: {data}")
        
        # Create location first
        location = Location(
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            address=data.get('address'),
            city=data.get('city'),
            province=data.get('province')
        )
        db.session.add(location)
        db.session.flush()  # Get the location ID
        
        # Create issue with location reference
        issue = Issue(
            title=data.get('title'),
            description=data.get('description'),
            status=data.get('status', 'open'),
            severity=data.get('severity', 'medium'),
            category=data.get('category', 'general'),
            location_id=location.id,
            user_id=user_id
        )
        
        db.session.add(issue)
        db.session.commit()

        return jsonify({
            'message': 'Issue created successfully',
            'issue': {
                'id': issue.id,
                'title': issue.title,
                'description': issue.description,
                'status': issue.status,
                'severity': issue.severity,
                'category': issue.category
            }
        }), 201

    except Exception as e:
        print(f"Error creating issue: {str(e)}")
        return jsonify({'error': str(e)}), 500

# --- Database Initialization ---

def create_tables():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    create_tables()  # Initialize database when app starts
    app.run(debug=True)
