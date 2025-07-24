from datetime import datetime
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# --- User Model ---
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """Set password (simple, no hashing)"""
        self.password = password
    
    def check_password(self, password):
        """Check password (simple comparison)"""
        return self.password == password

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# --- Category Model ---
class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    color_code = db.Column(db.String(7), default='#3B82F6')
    icon_name = db.Column(db.String(50), default='folder')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'color': self.color_code,  # Frontend expects 'color' not 'color_code'
            'icon': self.icon_name     # Frontend expects 'icon' not 'icon_name'
        }

# --- Location Model ---
# models.py

# ... (keep other models as they are)

class Location(db.Model):
    __tablename__ = 'locations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # --- ADD THESE MISSING COLUMNS ---
    type = db.Column(db.String(50), nullable=True)  # e.g., 'province', 'city', 'barangay'
    parent_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    # --- END OF ADDITIONS ---
    
    city = db.Column(db.String(100), nullable=False)
    province = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
            'province': self.province
            # You might want to add 'type' here as well if the frontend needs it
        }

# --- Issue Model ---
class Issue(db.Model):
    __tablename__ = 'issues'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='open')  # open, in_progress, resolved, closed
    severity = db.Column(db.String(20), default='medium')  # low, medium, high, critical
    address = db.Column(db.Text)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    media_urls = db.Column(db.JSON, default=list)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
    
    # Relationships
    user = db.relationship('User', backref='issues')
    category = db.relationship('Category', backref='issues')
    location = db.relationship('Location', backref='issues')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'severity': self.severity,
            'address': self.address,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'media_urls': self.media_urls or [],
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            'views': self.views,
            'comments_count': self.comments_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'user': self.user.to_dict() if self.user else None,
            'category': self.category.to_dict() if self.category else None,
            'location': self.location.to_dict() if self.location else None
        }

# --- Vote Model ---
class Vote(db.Model):
    __tablename__ = 'votes'
    
    id = db.Column(db.Integer, primary_key=True)
    vote_type = db.Column(db.String(10), nullable=False)  # 'up' or 'down'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    issue_id = db.Column(db.Integer, db.ForeignKey('issues.id'), nullable=False)
    
    # Relationships
    user = db.relationship('User', backref='votes')
    issue = db.relationship('Issue', backref='votes')
    
    # Unique constraint to prevent duplicate votes from same user on same issue
    __table_args__ = (db.UniqueConstraint('user_id', 'issue_id'),)

    def to_dict(self):
        return {
            'id': self.id,
            'vote_type': self.vote_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user': self.user.to_dict() if self.user else None
        }

# --- Comment Model ---
class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id'), nullable=True)  # For nested comments
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    issue_id = db.Column(db.Integer, db.ForeignKey('issues.id'), nullable=False)
    
    # Relationships
    user = db.relationship('User', backref='comments')
    issue = db.relationship('Issue', backref='comments')
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]))

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'parent_id': self.parent_id,
            'user': self.user.to_dict() if self.user else None,
            'replies_count': len(self.replies) if self.replies else 0
        }
