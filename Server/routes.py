from app import app, db , bcrypt
from flask import request, jsonify , session ,send_file
from app import app, db , bcrypt, UPLOAD_FOLDER
from flask import request, jsonify , session
from models import User
from docx import Document
from docx.shared import Pt
import os
from io import BytesIO
from extract_text import *
from werkzeug.utils import secure_filename
from extract_text import process_lease_document 
# import os

#To check the database value [To be removed before appending final code]
@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    result = [user.to_json() for user in users]
    return jsonify(result)

#User registration and value storing in Databases
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
    
#User Login
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
    
#User Logout From session
@app.route("/api/UserLogout" , methods=["POST"])
def UserLogout():
    session.pop('username' , None)
    return jsonify({"message" : "User Logged Out!"}),200

#Check Session Value , if logged in or not
@app.route('/api/session', methods=['GET'])
def check_session():
    if 'username' in session:
        return jsonify({'logged_in': True, 'username': session['username']}), 200
    return jsonify({'logged_in': False}), 401

#Creating Lease document
@app.route('/api/Generate_Lease', methods=["POST"])
def generate_lease():
    data = request.json  # Get the JSON data from the frontend
    lease_file = generate_lease_doc(data)  # Generate the .docx file
    return lease_file  # Return the file for download

def generate_lease_doc(data):
    template_path = "templates/lease_template.docx"
    doc = Document(template_path)

    # Replace placeholders in the template
    for para in doc.paragraphs:
        for key, value in data.items():
            if f'{{{key}}}' in para.text:  # Check if placeholder exists
                para.text = para.text.replace(f'{{{key}}}', str(value))
    
    # Set font to Cambria for the entire document
    for para in doc.paragraphs:
        for run in para.runs:
            run.font.name = 'Cambria'
    
    # Set font for tables if present
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    for run in para.runs:
                        run.font.name = 'Cambria'
                        run.font.size = Pt(12)  # Optional: set standard font size

    # Save the document to a BytesIO object (in-memory file)
    output = BytesIO()
    doc.save(output)
    output.seek(0)  # Move the cursor to the beginning of the file

    # Return the file as a response
    return send_file(
        output,
        as_attachment=True,
        download_name="generated_lease.docx",
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )

#default [To be removed]
@app.route('/')
def home():
    return "Hello World"

@app.route('/api/Pdf_Analysis', methods=['POST'])
def analyze_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)  # Save the uploaded file

    # Process the document and extract clauses
    result = process_lease_document(file_path)

    # Include the file path in the response to display it in the frontend
    return jsonify({"filename": filename, "clauses": result})