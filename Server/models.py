from datetime import datetime
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False) # Hashed Password
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    documents = db.relationship('UserDocument', backref='author', lazy=True)  # Changed from 'Document' to 'UserDocument'

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,              
            "password": self.password,
            "is_admin": self.is_admin
        }

class UserDocument(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(500), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='drafted')  # drafted, completed, etc.
    analysis_data = db.Column(db.Text, nullable=True) # JSON Blob
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "filepath": self.filepath,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id
        }