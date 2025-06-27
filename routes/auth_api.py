from flask import Blueprint, request, jsonify, session
from models.models import User, db

auth_api_bp = Blueprint('auth_api', __name__)

@auth_api_bp.route('/register', methods=['POST'])
def register():
    print("🔍 DEBUG: Register endpoint called")
    try:
        data = request.get_json()
        print(f"🔍 DEBUG: Received data: {data}")
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')
        
        if not all([name, email, password]):
            print("🔍 DEBUG: Missing required fields")
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            print(f"🔍 DEBUG: User already exists: {email}")
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        user = User(
            name=name,
            email=email,
            phone=phone
        )
        user.set_password(password)  # Use proper password hashing
        print(f"🔍 DEBUG: Created user object: {user.name}")
        
        db.session.add(user)
        db.session.commit()
        print(f"🔍 DEBUG: User saved to database with ID: {user.id}")
        
        # Log user in
        session['user_id'] = user.id
        print(f"🔍 DEBUG: User logged in with session ID: {user.id}")
        
        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        print(f"🔍 DEBUG: Registration error: {e}")
        return jsonify({'error': str(e)}), 500

@auth_api_bp.route('/login', methods=['POST'])
def login():
    print("🔍 DEBUG: Login endpoint called")
    try:
        data = request.get_json()
        print(f"🔍 DEBUG: Login data: {data}")
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            print("🔍 DEBUG: Missing email or password")
            return jsonify({'error': 'Missing email or password'}), 400
        
        user = User.query.filter_by(email=email).first()
        print(f"🔍 DEBUG: Found user: {user.name if user else 'None'}")
        
        if user and user.check_password(password):
            print(f"🔍 DEBUG: Password check successful")
            session['user_id'] = user.id
            user.last_login = db.func.now()
            db.session.commit()
            print(f"🔍 DEBUG: User logged in with session ID: {user.id}")
            
            return jsonify({
                'message': 'Login successful',
                'user': user.to_dict()
            }), 200
        else:
            print(f"🔍 DEBUG: Invalid credentials")
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        print(f"🔍 DEBUG: Login error: {e}")
        return jsonify({'error': str(e)}), 500

@auth_api_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'}), 200

@auth_api_bp.route('/me', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200

@auth_api_bp.route('/profile', methods=['PUT'])
def update_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'avatar_url' in data:
            user.avatar_url = data['avatar_url']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
