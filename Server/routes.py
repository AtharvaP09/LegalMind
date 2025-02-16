from app import app, db
from flask import request, jsonify
from models import User

@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    result = [user.to_json() for user in users]
    return jsonify(result)




