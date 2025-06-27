from datetime import datetime
from flask_login import UserMixin
from backend import db

# --- Location Model ---
class Location(db.Model):
    __tablename__ = 'locations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
    latitude = db.Column(db.Numeric(10, 8))
    longitude = db.Column(db.Numeric(11, 8))
    postal_code = db.Column(db.String(20))
    population = db.Column(db.Integer)
    area_km2 = db.Column(db.Numeric(10, 2))
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Self-referential relationship
    parent = db.relationship('Location', remote_side=[id], backref='children')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'parent_id': self.parent_id,
            'latitude': float(self.latitude) if self.latitude else None,
            'longitude': float(self.longitude) if self.longitude else None,
            'postal_code': self.postal_code,
            'population': self.population,
            'area_km2': float(self.area_km2) if self.area_km2 else None,
            'description': self.description,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# --- Department Model ---
class Department(db.Model):
    __tablename__ = 'departments'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    contact_email = db.Column(db.String(255))
    contact_phone = db.Column(db.String(20))
    head_name = db.Column(db.String(255))
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'head_name': self.head_name,
            'location_id': self.location_id,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# --- User Model ---
class User(db.Model, UserMixin):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    avatar_url = db.Column(db.String(500))
    role = db.Column(db.String(20), default='citizen')
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    email_verified_at = db.Column(db.DateTime)
    phone_verified_at = db.Column(db.DateTime)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    address = db.Column(db.Text)
    postal_code = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(20))
    occupation = db.Column(db.String(255))
    bio = db.Column(db.Text)
    language_preference = db.Column(db.String(10), default='en')
    timezone = db.Column(db.String(50), default='UTC')
    email_notifications = db.Column(db.Boolean, default=True)
    sms_notifications = db.Column(db.Boolean, default=False)
    push_notifications = db.Column(db.Boolean, default=True)
    profile_visibility = db.Column(db.String(20), default='public')
    show_real_name = db.Column(db.Boolean, default=True)
    show_location = db.Column(db.Boolean, default=True)
    reputation_score = db.Column(db.Integer, default=0)
    total_issues_reported = db.Column(db.Integer, default=0)
    total_votes_cast = db.Column(db.Integer, default=0)
    total_comments_made = db.Column(db.Integer, default=0)
    failed_login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime)
    last_password_change = db.Column(db.DateTime, default=datetime.utcnow)
    two_factor_enabled = db.Column(db.Boolean, default=False)
    two_factor_secret = db.Column(db.String(32))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'avatar_url': self.avatar_url,
            'role': self.role,
            'is_verified': self.is_verified,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'location_id': self.location_id,
            'address': self.address,
            'occupation': self.occupation,
            'bio': self.bio
        }

# --- Category Model ---
class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    color_code = db.Column(db.String(7))
    icon_name = db.Column(db.String(50))
    parent_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Self-referential relationship
    parent = db.relationship('Category', remote_side=[id], backref='children')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'color_code': self.color_code,
            'icon_name': self.icon_name,
            'parent_id': self.parent_id,
            'is_active': self.is_active,
            'sort_order': self.sort_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# --- Issue Model ---
class Issue(db.Model):
    __tablename__ = 'issues'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='open')
    priority = db.Column(db.String(20), default='medium')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    assigned_department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    assigned_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    latitude = db.Column(db.Numeric(10, 8))
    longitude = db.Column(db.Numeric(11, 8))
    address = db.Column(db.Text)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    view_count = db.Column(db.Integer, default=0)
    is_anonymous = db.Column(db.Boolean, default=False)
    is_urgent = db.Column(db.Boolean, default=False)
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    closed_at = db.Column(db.DateTime)

    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], backref='issues')
    location = db.relationship('Location', foreign_keys=[location_id])
    category = db.relationship('Category', foreign_keys=[category_id])
    department = db.relationship('Department', foreign_keys=[assigned_department_id])
    assigned_user = db.relationship('User', foreign_keys=[assigned_user_id])

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'user_id': self.user_id,
            'location_id': self.location_id,
            'category_id': self.category_id,
            'latitude': float(self.latitude) if self.latitude else None,
            'longitude': float(self.longitude) if self.longitude else None,
            'address': self.address,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            'view_count': self.view_count,
            'is_anonymous': self.is_anonymous,
            'is_urgent': self.is_urgent,
            'is_public': self.is_public,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user': self.user.to_dict() if self.user else None,
            'location': self.location.to_dict() if self.location else None,
            'category': self.category.to_dict() if self.category else None
        }

# --- Vote Model ---
class Vote(db.Model):
    __tablename__ = 'votes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    issue_id = db.Column(db.Integer, db.ForeignKey('issues.id'), nullable=False)
    vote_type = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'issue_id', name='unique_user_vote'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'issue_id': self.issue_id,
            'vote_type': self.vote_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# --- Comment Model ---
class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    issue_id = db.Column(db.Integer, db.ForeignKey('issues.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    is_official = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)
    edited_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', foreign_keys=[user_id])
    issue = db.relationship('Issue', foreign_keys=[issue_id])
    parent = db.relationship('Comment', remote_side=[id], backref='replies')

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'user_id': self.user_id,
            'issue_id': self.issue_id,
            'parent_id': self.parent_id,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            'is_official': self.is_official,
            'is_deleted': self.is_deleted,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user': self.user.to_dict() if self.user else None
        }

# --- Notification Model ---
class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    data = db.Column(db.JSON)
    is_read = db.Column(db.Boolean, default=False)
    is_sent = db.Column(db.Boolean, default=False)
    related_issue_id = db.Column(db.Integer, db.ForeignKey('issues.id'))
    related_comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    related_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    read_at = db.Column(db.DateTime)
    sent_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'data': self.data,
            'is_read': self.is_read,
            'is_sent': self.is_sent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'read_at': self.read_at.isoformat() if self.read_at else None
        }
