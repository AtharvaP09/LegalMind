from app import app, db , bcrypt
from flask import request, jsonify , session
from models import User

@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    result = [user.to_json() for user in users]
    return jsonify(result)

@app.route("/api/UserRegistration" , methods=["POST"])  
def UserRegistration():
    data = request.json
    if User.query.filter_by(username = data['username']).first() or User.query.filter_by(email = data['email']).first():
        return jsonify({"message" : "User already exists!"}),400
    else:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(username = data['username'] , email = data['email'] , password = hashed_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message" : "User Registered Successfully!"}),201
    
@app.route("/api/UserLogin" , methods=["POST"])
def UserLogin():
    data = request.get_json()
    email = data.get("email")
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"message": "Email and password are required!"}), 400
        
    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        session['username'] = user.username
        return jsonify({"message": "User Logged In!", 'username': session['username']}), 200
    else:
        return jsonify({"message": "Invalid Credentials!"}), 400
    
    
@app.route("/api/UserLogout" , methods=["POST"])
def UserLogout():
    session.pop('username' , None)
    return jsonify({"message" : "User Logged Out!"}),200


@app.route('/api/session', methods=['GET'])
def check_session():
    if 'username' in session:
        return jsonify({'logged_in': True, 'username': session['username']}), 200
    return jsonify({'logged_in': False}), 401


@app.route('/')
def home():
    return "Hello World"
