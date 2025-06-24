from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from backend import db

# --- User Model ---
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='citizen')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# --- Placeholder Models & ERD Plan ---
# class Issue(db.Model):
#     pass
# class Confirmation(db.Model):
#     pass
# class Admin(db.Model):
#     pass
# class StatusChange(db.Model):
#     pass
# class NotificationLog(db.Model):
#     pass

# ERD (draft):
# User --< Issue --< StatusChange
# User --< Confirmation
# Admin (inherits User or role)
# Issue --< NotificationLog
