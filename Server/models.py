from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer , primary_key = True , autoincrement = True )
    username = db.Column(db.String(150) , nullable=False)
    email = db.Column(db.String(150) , unique = True , nullable=False)
    password = db.Column(db.String(150), nullable=False)

    

    def to_json(self):
        return {
            "id" : self.id,
            "username" : self.username,
            "email" : self.email,              
            "password" : self.password
        }


