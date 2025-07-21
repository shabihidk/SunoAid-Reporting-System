from flask import Flask, jsonify, request, send_from_directory
import os
from dotenv import load_dotenv
from models.models import db
from flask_login import LoginManager
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize extensions
login_manager = LoginManager()

# Static file serving for uploads
@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('static/uploads', filename)

# Database configuration with fallback
database_url = os.getenv('DATABASE_URL')
if not database_url:
    # Fallback configuration for development
    database_url = 'postgresql://postgres:password@localhost:5432/SunoAid'
    print("⚠️  WARNING: Using fallback database URL. Please set DATABASE_URL in .env file")

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Secret key configuration with fallback
secret_key = os.getenv('SECRET_KEY')
if not secret_key:
    secret_key = 'dev-secret-key-change-in-production'
    print("⚠️  WARNING: Using fallback secret key. Please set SECRET_KEY in .env file")

app.secret_key = secret_key

# Session configuration for cross-origin requests
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = None  # Allow cross-origin session cookies
app.config['SESSION_COOKIE_DOMAIN'] = None   # Allow localhost domains

# Initialize extensions
db.init_app(app)
login_manager.init_app(app)
login_manager.login_view = 'auth_api.login'

# CORS configuration
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
CORS(app, 
     origins=[frontend_url, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], 
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Import API blueprints
from routes.auth_api import auth_api_bp
from routes.issues_api import issues_api_bp
from routes.locations_api import locations_api_bp
from routes.upload_api import upload_api_bp

# Register blueprints
app.register_blueprint(auth_api_bp, url_prefix='/api/auth')
app.register_blueprint(issues_api_bp, url_prefix='/api/issues')
app.register_blueprint(locations_api_bp, url_prefix='/api/locations')
app.register_blueprint(upload_api_bp, url_prefix='/api/upload')

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "message": "SunoAid API is running",
        "version": "1.0.0"
    })

@app.route('/api/config')
def get_config():
    """Get frontend configuration"""
    return jsonify({
        "api_url": request.host_url + "api",
        "upload_max_size": app.config.get('MAX_CONTENT_LENGTH', 16777216),
        "version": "1.0.0"
    })

if __name__ == '__main__':
    with app.app_context():
        try:
            # Test database connection
            with db.engine.connect() as connection:
                connection.execute(db.text('SELECT 1'))
            print("✅ Database connection successful!")
            
            # Create tables if they don't exist (for development)
            # Note: In production, use proper migrations
            db.create_all()
            
            # Create default categories if they don't exist
            from models.models import Category
            if not Category.query.first():
                print("📝 Creating default categories...")
                categories = [
                    Category(name="Infrastructure", description="Roads, bridges, utilities", color_code="#3B82F6", icon_name="construction"),
                    Category(name="Sanitation", description="Waste management, cleanliness", color_code="#10B981", icon_name="trash"),
                    Category(name="Water Supply", description="Water shortage, quality issues", color_code="#06B6D4", icon_name="droplet"),
                    Category(name="Electricity", description="Power outages, electrical issues", color_code="#F59E0B", icon_name="zap"),
                    Category(name="Transportation", description="Public transport, traffic", color_code="#8B5CF6", icon_name="bus"),
                    Category(name="Healthcare", description="Medical facilities, health services", color_code="#EF4444", icon_name="heart"),
                    Category(name="Education", description="Schools, educational resources", color_code="#EC4899", icon_name="book"),
                    Category(name="Environment", description="Pollution, environmental concerns", color_code="#22C55E", icon_name="leaf"),
                    Category(name="Security", description="Safety, crime, security issues", color_code="#6B7280", icon_name="shield"),
                    Category(name="Other", description="Other civic issues", color_code="#9CA3AF", icon_name="help-circle")
                ]
                for category in categories:
                    db.session.add(category)
                db.session.commit()
                print("✅ Default categories created!")
            
            print(f"🚀 Starting SunoAid API server on http://localhost:5000")
            print(f"📱 Frontend should be running on {frontend_url}")
            print("📊 API Health Check: http://localhost:5000/api/health")
            
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            print("💡 Please check your database configuration and ensure PostgreSQL is running")
            print("💡 Run 'python setup_database.py' to set up the database")
            exit(1)
    
    # Start the Flask development server
    app.run(
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true',
        port=int(os.getenv('FLASK_PORT', 5000)),
        host=os.getenv('FLASK_HOST', '127.0.0.1')
    )

