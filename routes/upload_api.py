from flask import Blueprint, request, jsonify
import os
import uuid
from werkzeug.utils import secure_filename

upload_api_bp = Blueprint('upload_api', __name__)

# Configure upload settings
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_api_bp.route('/', methods=['POST'])
@upload_api_bp.route('', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Create uploads directory if it doesn't exist
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            # Generate unique filename
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
            filename = secure_filename(unique_filename)
            
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            
            # Return the absolute URL path for the uploaded file
            file_url = f"http://localhost:5000/static/uploads/{filename}"
            
            return jsonify({
                'message': 'File uploaded successfully',
                'url': file_url,
                'filename': filename
            }), 200
        else:
            return jsonify({'error': 'File type not allowed'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
