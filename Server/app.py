from flask import Flask , jsonify , request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import routes
from flask_restful import Api, Resource
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identityclear

app = Flask(__name__)
cors = CORS(app , origins='*')


app.config['SECRET_KEY'] = ' SUPER-SECRET-KEY'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db = SQLAlchemy(app)

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug = True , port = 8080)