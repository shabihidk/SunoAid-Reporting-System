# Enable CORS for frontend-backend connection
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Allow Vite dev server

# ...existing code (import blueprints, db, login_manager, etc.)...

if __name__ == "__main__":
    app.run(debug=True)
