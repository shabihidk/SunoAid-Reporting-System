from flask import Blueprint, render_template
from flask_login import login_required, current_user

# Dashboard Blueprint



dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
@login_required
def index():
    return render_template('dashboard.html', user=current_user)

@dashboard_bp.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)
