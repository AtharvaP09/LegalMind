from flask import Flask, jsonify, request, session
from flask_session import Session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Enable CORS for frontend communication (allow production URL)
frontend_url = os.environ.get("FRONTEND_URL", "https://legalminds6.netlify.app/")
# Split frontend URLs if multiple are provided via comma
origins = [url.strip() for url in frontend_url.split(",")]
CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)

# Upload Folder Configuration
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the upload directory exists
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Database Configuration
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", "SUPER-SECRET-KEY")

database_url = os.environ.get("DATABASE_URL", "sqlite:///database.db")
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url

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

with app.app_context():
    db.create_all()  # Ensure all database tables are created

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
