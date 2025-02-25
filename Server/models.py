from app import db

class User(db.Model):
    id = db.Column(db.Integer , primary_key = True , autoincrement = True )
    username = db.Column(db.String(150) , nullable=False)
    email = db.Column(db.String(150) , unique = True , nullable=False)
    password = db.Column(db.String(200), nullable=False) # Hashed Password

    def to_json(self):
        return {
            "id" : self.id,
            "username" : self.username,
            "email" : self.email,              
            "password" : self.password
        }


