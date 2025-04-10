from flask import request, jsonify, session, send_file
from app import app, db, bcrypt, UPLOAD_FOLDER
from models import User, UserDocument
from docx import Document as DocxDocument
from docx.shared import Pt
import os
from io import BytesIO
from extract_text import *
from werkzeug.utils import secure_filename
from llama_cpp import Llama
from generate_lease import generate_lease_doc

USER_DOCUMENTS_DIR = "UserDocuments"
os.makedirs(USER_DOCUMENTS_DIR, exist_ok=True)

MODEL_PATH = "d:/Models/mistral-7b-instruct-v0.2.Q3_K_M.gguf"

#To check the database value [To be removed before appending final code]
@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    result = [user.to_json() for user in users]
    return jsonify(result)

#User registration and value storing in Databases
@app.route("/api/UserRegistration", methods=["POST"])  
def UserRegistration():
    data = request.json
    if User.query.filter_by(username = data['username']).first() or User.query.filter_by(email = data['email']).first():
        return jsonify({"message": "User already exists!"}), 400
    else:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(username = data['username'], email = data['email'], password = hashed_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User Registered Successfully!"}), 201
    
#User Login
@app.route("/api/UserLogin", methods=["POST"])
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
@app.route("/api/UserLogout", methods=["POST"])
def UserLogout():
    session.pop('username', None)
    return jsonify({"message": "User Logged Out!"}), 200

#Check Session Value, if logged in or not
@app.route('/api/session', methods=['GET'])
def check_session():
    if 'username' in session:
        return jsonify({'logged_in': True, 'username': session['username']}), 200
    return jsonify({'logged_in': False}), 401

#Creating Lease document
@app.route('/api/Generate_Lease', methods=["POST"])
def generate_lease():
    try:
        data = request.json
        document_name = data.get('documentName', 'lease-agreement')
        username = data.get('username', 'anonymous')
        save_to_user_folder = data.get('saveToUserFolder', False)
        
        # Generate the document
        doc = generate_lease_doc(data)
        
        if save_to_user_folder:
            # Create user directory if it doesn't exist
            user_dir = os.path.join(USER_DOCUMENTS_DIR, username)
            os.makedirs(user_dir, exist_ok=True)
            
            # Save the document to user's folder
            file_path = os.path.join(user_dir, f"{document_name}.docx")
            doc.save(file_path)
            
            # Find user in database
            user = User.query.filter_by(username=username).first()
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            # Save document info to database - using UserDocument instead of Document
            new_doc = UserDocument(
                filename=f"{document_name}.docx",
                filepath=file_path,
                status='drafted',
                user_id=user.id
            )
            db.session.add(new_doc)
            db.session.commit()
            
            return jsonify({
                "success": True,
                "message": f"Document saved to {file_path}",
                "file_path": file_path,
                "document_id": new_doc.id
            })
        else:
            # Return the file for download
            output = BytesIO()
            doc.save(output)
            output.seek(0)
            
            return send_file(
                output,
                as_attachment=True,
                download_name=f"{document_name}.docx",
                mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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

#Endpoint to fetch user created files
@app.route('/api/user/documents/stats', methods=['GET'])
def get_user_document_stats():
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "Username is required"}), 400
        
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Count drafted documents
        drafted_count = UserDocument.query.filter_by(
            user_id=user.id,
            status='drafted'
        ).count()
        
        # Count analyzed documents (you'll need to implement this based on your analysis records)
        analyzed_count = 0  # Placeholder - implement your analysis counting logic
        
        return jsonify({
            "drafted_count": drafted_count,
            "analyzed_count": analyzed_count,
            "success": True
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "traceback": str(e.__traceback__)}), 500
    
@app.route('/api/user/documents', methods=['GET'])
def get_user_documents():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    documents = UserDocument.query.filter_by(user_id=user.id).order_by(UserDocument.created_at.desc()).all()
    result = [doc.to_json() for doc in documents]
    return jsonify({"documents": result})

    

# Initialize model
def initialize_model():
    try:
        # Adjust these parameters based on your system's capabilities
        model = Llama(
            model_path=MODEL_PATH,
            n_ctx=4096,          # Context window size
            n_gpu_layers=-1,     # Use all GPU layers if available
            n_threads=4          # Number of CPU threads
        )
        print("Mistral model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

# Load model
model = initialize_model()

# Lease clause generation prompt template specific to Indian rental agreements
def create_indian_lease_prompt(property_type, lease_term, rent_amount, property_location, clause_request):
    return f"""<s>[INST] You are a legal expert specializing in Indian real estate and rental agreements. 
Generate ONLY THE SINGLE PARAGRAPH CLAUSE CONTENT for an Indian lease agreement based on the request.

The clause must:
1. Be exactly one clear, concise paragraph
2. Use formal legal language appropriate for Indian contracts
3. Use terms Lessor (owner) and Lessee (tenant)
4. Focus only on the substantive legal content
5. Omit all headings, titles, signatures, dates or section numbers
6. Be specific to Indian rental law context

Lease Context:
- Property Type: {property_type}
- Lease Term: {lease_term} 
- Monthly Rent: {rent_amount}
- Location: {property_location}

Request: {clause_request}

Provide ONLY the single paragraph clause content that would be inserted into a larger agreement.
[/INST]</s>
"""

@app.route('/api/generate_clause', methods=['POST'])
def generate_clause():
    if model is None:
        return jsonify({"error": "Model not loaded. Check server logs."}), 500
        
    data = request.json
    
    # Extract required information from the form data
    try:
        property_type = data.get("What is the type of Rental", "Apartment")
        
        # Handle the years/months format
        years = data.get("For how many Years/Months is the lease term?,years", "1")
        months = data.get("For how many Years/Months is the lease term?,months", "0")
        lease_term = f"{years} years and {months} months"
        
        rent_amount = data.get("What should be the monthly rent?", "₹15,000")
        
        # Construct property location
        property_location = f"{data.get('Property Address Line 1', '')}, " \
                           f"{data.get('City(Property)', '')}, " \
                           f"{data.get('State(Property)', '')}"
        
        clause_request = data.get("clause_request", "")
        
        if not clause_request:
            return jsonify({"error": "No clause request provided"}), 400
            
        # Format the prompt
        prompt = create_indian_lease_prompt(
            property_type=property_type,
            lease_term=lease_term,
            rent_amount=rent_amount,
            property_location=property_location,
            clause_request=clause_request
        )
        
        # Generate response
        response = model(
            prompt, 
            max_tokens=1024,
            temperature=0.7,
            top_p=0.95,
            repeat_penalty=1.15,
            echo=False
        )
        
        # Extract the generated text
        generated_text = response["choices"][0]["text"].strip()
        
        # Post-process to ensure Indian legal terminology
        # Remove any "Section X.X" format if it appears
        import re
        processed_text = re.sub(r'Section \d+\.\d+:', '', generated_text)
        processed_text = re.sub(r'Section \d+:', '', processed_text)
        
        return jsonify({
            "success": True,
            "clause": processed_text
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add a route to get clause examples
@app.route('/api/clause_examples', methods=['GET'])
def get_clause_examples():
    # Common clause examples for Indian rental agreements
    examples = [
        {
            "title": "Prohibition on Alterations",
            "description": "A clause that prevents tenants from making alterations to the property without permission",
            "example": "PROHIBITION ON ALTERATIONS: The Tenant shall not make any structural alterations or additions to the premises or make any changes that may affect the exterior appearance of the building without obtaining prior written consent from the Landlord. Any unapproved alterations may result in a penalty of ₹500 per day until rectified, and the Tenant shall bear the cost of restoring the property to its original condition."
        },
        {
            "title": "Pet Policy",
            "description": "Rules regarding keeping pets in the rented property",
            "example": "PET POLICY: The Tenant is permitted to keep small pets weighing less than 10 kg, limited to one pet per household, subject to paying an additional security deposit of ₹10,000. The Tenant shall be responsible for any damage caused by the pet and ensure that it does not cause nuisance to neighbors. Any violation may result in termination of this permission upon written notice by the Landlord."
        },
        {
            "title": "Maintenance Responsibilities",
            "description": "Defines who is responsible for different types of maintenance",
            "example": "MAINTENANCE RESPONSIBILITIES: The Landlord shall be responsible for major repairs including structural issues, electrical wiring problems, and plumbing system failures. The Tenant shall be responsible for minor repairs costing less than ₹1,000 and for maintaining fixtures, fittings, and appliances in good working condition. The Tenant shall promptly inform the Landlord of any major repairs required."
        }
    ]
    
    return jsonify({"success": True, "examples": examples})

#default[To be removed]
@app.route('/')
def home():
    return "Hello World"