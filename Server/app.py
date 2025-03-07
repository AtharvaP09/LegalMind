from flask import Flask, jsonify, request, session
from flask_session import Session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import os

app = Flask(__name__)

# Enable CORS for frontend communication
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Upload Folder Configuration
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the upload directory exists
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Database Configuration
app.config['SECRET_KEY'] = 'SUPER-SECRET-KEY'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

# Session Configuration
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False

# Initialize Extensions
db = SQLAlchemy(app)
Session(app)
bcrypt = Bcrypt(app)

# Routes Import (Keep at the end to avoid circular imports)
from routes import *

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Ensure all database tables are created
    app.run(port=5000, debug=True)
