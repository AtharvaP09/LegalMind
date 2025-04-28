from flask import request, jsonify, session, send_file
from app import app, db, bcrypt, UPLOAD_FOLDER
from models import User, UserDocument
from docx import Document as DocxDocument
from docx.shared import Pt
import os
from io import BytesIO
import traceback
from extract_text import *
from werkzeug.utils import secure_filename
from llama_cpp import Llama
from generate_lease import generate_lease_doc
from LegalMind_logs import log_event  # Logging module imported
import hashlib
from hashing_document import generate_file_hashes
from PyPDF2 import PdfReader
from datetime import datetime
import re

def generate_file_hash(file_path, algorithm='sha256'):
    """
    Generate a cryptographic hash for a file.
    Defaults to SHA-256 for security.
    Args:
        file_path (str): Path to the file
        algorithm (str): Hash algorithm (default: 'sha256')
    Returns:
        str: Hexadecimal hash digest
    Raises:
        ValueError: If algorithm is unsupported
        RuntimeError: If file hashing fails
    """
    if algorithm not in hashlib.algorithms_available:
        raise ValueError(f"Unsupported algorithm. Choose from: {hashlib.algorithms_available}")

    hash_obj = hashlib.new(algorithm)
    try:
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b''):
                hash_obj.update(chunk)
        return hash_obj.hexdigest()
    except Exception as e:
        raise RuntimeError(f"Hashing failed: {str(e)}")


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
        # 1. Parse request data
        data = request.get_json()  # Changed from request.json to get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        document_name = data.get('documentName', 'lease-agreement')
        username = data.get('username', 'anonymous')
        save_to_user_folder = data.get('saveToUserFolder', False)
        data.setdefault('additional_clauses', [])

        # 2. Generate document
        doc = generate_lease_doc(data)
        if not doc:
            raise RuntimeError("Document generation failed")

        if save_to_user_folder:
            # 3. Handle file save
            user_dir = os.path.join(USER_DOCUMENTS_DIR, username)
            os.makedirs(user_dir, exist_ok=True)
            file_path = os.path.join(user_dir, f"{document_name}.docx")
            
            try:
                doc.save(file_path)
            except Exception as save_error:
                raise RuntimeError(f"Failed to save document: {str(save_error)}")

            # 4. Generate hash
            file_hash = None
            try:
                file_hash = generate_file_hashes(file_path)
            except Exception as hash_error:
                log_event(
                    user_id=None,  # Will be set after user lookup
                    action='hash_failed', 
                    document=document_name
                )

            # 5. Database operations
            user = User.query.filter_by(username=username).first()
            if not user:
                return jsonify({"error": "User not found"}), 404

            new_doc = UserDocument(
                filename=f"{document_name}.docx",
                filepath=file_path,
                status='drafted',
                user_id=user.id,
                # file_hash=file_hash
            )
            
            try:
                db.session.add(new_doc)
                db.session.commit()
            except Exception as db_error:
                db.session.rollback()
                raise RuntimeError(f"Database error: {str(db_error)}")

            log_event(
                user_id=user.id,
                action='generate',
                document=file_hash or document_name
            )

            return jsonify({
                "success": True,
                "file_path": file_path,
                "document_id": new_doc.id,
                "file_hash": file_hash
            })

        else:
            # 6. Handle download
            output = BytesIO()
            doc.save(output)
            output.seek(0)
            
            download_hash = hashlib.sha256(output.getvalue()).hexdigest()
            output.seek(0)

            response = send_file(
                output,
                as_attachment=True,
                download_name=f"{document_name}.docx",
                mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
            response.headers['X-File-Hash'] = download_hash
            return response

    except Exception as e:
        # Log the full error trace
        app.logger.error(f"Error in generate_lease: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Document generation failed",
            "details": str(e)
        }), 500


@app.route('/api/Pdf_Analysis', methods=['POST'])
def analyze_pdf():
    """Endpoint for analyzing PDF lease agreements with Mistral 7B"""
    # Validate file upload
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Secure file handling
    filename = secure_filename(file.filename)
    temp_path = os.path.join(UPLOAD_FOLDER, f"temp_{int(datetime.now().timestamp())}_{filename}")
    file.save(temp_path)

    try:
        # Step 1: Extract text from PDF
        raw_text = extract_text_from_pdf(temp_path)
        if not raw_text or len(raw_text) < 100:
            return jsonify({"error": "Failed to extract text from PDF"}), 400

        # Step 2: Generate structured analysis
        analysis = generate_structured_analysis(raw_text, filename)
        
        # Step 3: Store analysis in database if user authenticated
        username = request.form.get('username')
        if username:
            store_analysis_result(username, filename, analysis)

        return jsonify({
            "success": True,
            "analysis": analysis
        })

    except Exception as e:
        print(f"Analysis error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            "error": "Analysis failed",
            "message": str(e)
        }), 500

    finally:
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

def extract_text_from_pdf(file_path):
    """Robust PDF text extraction with error handling"""
    try:
        text = ""
        with open(file_path, 'rb') as f:
            reader = PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ""
        return text.strip()
    except Exception as e:
        print(f"PDF extraction failed: {str(e)}")
        return ""

def generate_structured_analysis(text, filename):
    """Generate structured analysis using Mistral 7B"""
    # Step 1: First extract basic details with regex (more reliable)
    basic_details = extract_basic_details_with_regex(text, filename)
    
    # Step 2: Use Mistral for clause analysis
    clauses = analyze_clauses_with_mistral(text)
    
    # Step 3: Generate summary
    summary = generate_summary_from_clauses(clauses)
    
    return {
        "basicDetails": basic_details,
        "clauses": clauses,
        "summary": summary
    }

def extract_basic_details_with_regex(text, filename):
    """Enhanced extraction for your specific document format"""
    # Handle asterisk-marked parties
    parties = []
    lessor_match = re.search(r'(?i)Lessor:\s*\*([^\n*]+)\*', text)
    lessee_match = re.search(r'(?i)Lessee:\s*\*([^\n*]+)\*', text)
    
    if lessor_match:
        parties.append(f"Lessor: {lessor_match.group(1).strip()}")
    if lessee_match:
        parties.append(f"Lessee: {lessee_match.group(1).strip()}")
    
    # Handle "1 Years 0 Months" format
    term_match = re.search(
        r'(?i)Term\s*of\s*(\d+)\s*Years\s*(\d+)\s*Months',
        text
    )
    term = "Not specified"
    if term_match:
        years = term_match.group(1)
        months = term_match.group(2)
        term = f"{years} Year{'s' if int(years) != 1 else ''} {months} Month{'s' if int(months) != 1 else ''}"
    
    # Handle rent amount
    rent_match = re.search(
        r'(?i)Rent Amount[\s:]*([^\n]+)',
        text
    )
    rent_amount = rent_match.group(1).strip() if rent_match else "Not specified"
    
    return {
        "documentName": filename,
        "parties": parties if parties else ["Party 1: Not specified", "Party 2: Not specified"],
        "effectiveDate": "Not specified",  # Not in your sample
        "term": term,
        "rentAmount": rent_amount
    }

def analyze_clauses_with_mistral(text):
    """Use Mistral 7B to analyze and extract clauses"""
    prompt = f"""<s>[INST] Analyze this lease agreement text and extract the most important clauses in JSON format.
Return exactly 5-7 main clauses with their content and potential issues.

Document Text:
{text[:12000]}... [truncated]

Required JSON format:
{{
  "clauses": [
    {{
      "name": "Clause Name",
      "content": "Main content of clause",
      "issues": ["Potential issue 1", "Potential issue 2"]
    }}
  ]
}}

Focus on these key clauses:
- Rent and Payment Terms
- Security Deposit
- Maintenance Responsibilities
- Termination Conditions
- Property Use Restrictions
- Entry and Inspection
- Subletting and Assignment
[/INST]</s>"""

    try:
        response = model(
            prompt,
            max_tokens=2500,
            temperature=0.4,
            top_p=0.9,
            stop=["</s>"],
            echo=False
        )
        
        # Extract and parse JSON from response
        response_text = response['choices'][0]['text']
        json_str = re.search(r'\{.*\}', response_text, re.DOTALL).group()
        clauses_data = json.loads(json_str)
        
        # Post-process clauses
        processed_clauses = []
        for clause in clauses_data.get('clauses', [])[:7]:  # Limit to 7 clauses
            if not clause.get('name') or not clause.get('content'):
                continue
                
            processed_clauses.append({
                "name": clause['name'].strip(),
                "content": clause['content'].strip(),
                "issues": [issue.strip() for issue in clause.get('issues', [])[:3]]  # Max 3 issues
            })
        
        return processed_clauses
    
    except Exception as e:
        print(f"Mistral clause analysis failed: {str(e)}")
        return generate_fallback_clauses(text)

def generate_fallback_clauses(text):
    """Fallback clause extraction when Mistral fails"""
    clauses = []
    
    # Convert iterator to list before slicing
    numbered_matches = list(re.finditer(
        r'(?i)(\n|^)\s*(\d+)\.\s*([^\n:]+)[:\s]*(.*?)(?=\n\s*\d+\.|\Z)', 
        text, 
        re.DOTALL
    ))
    
    # Take first 7 matches
    for match in numbered_matches[:7]:
        clauses.append({
            "name": match.group(3).strip(),
            "content": match.group(4).strip(),
            "issues": []
        })
    
    # If no numbered clauses, look for section headings
    if not clauses:
        heading_matches = list(re.finditer(
            r'(?i)(\n|^)\s*([A-Z][A-Z\s]+)[:\s]*\n', 
            text
        ))
        
        for match in heading_matches[:7]:
            start = match.end()
            end = text.find('\n\n', start)
            content = text[start:end].strip() if end != -1 else text[start:].strip()
            
            clauses.append({
                "name": match.group(2).strip(),
                "content": content,
                "issues": []
            })
    
    return clauses
def generate_summary_from_clauses(clauses):
    """Generate summary based on analyzed clauses"""
    potential_issues = 0
    recommendations = []
    
    # Count issues and generate recommendations
    for clause in clauses:
        potential_issues += len(clause['issues'])
        
        # Clause-specific recommendations
        if 'deposit' in clause['name'].lower() and 'refund' not in clause['content'].lower():
            recommendations.append("Clarify security deposit refund conditions")
        
        if 'termination' in clause['name'].lower() and 'notice' not in clause['content'].lower():
            recommendations.append("Specify termination notice period")
    
    # Default recommendations if none found
    if not recommendations:
        recommendations = [
            "Review with legal professional",
            "Ensure all key terms are clearly defined",
            "Consider adding dispute resolution clause"
        ]
    
    return {
        "potentialIssues": max(1, potential_issues),  # At least 1 issue
        "notableClauses": len(clauses),
        "recommendations": recommendations[:5]  # Max 5 recommendations
    }

def store_analysis_result(username, filename, analysis):
    """Store analysis result in database"""
    try:
        user = User.query.filter_by(username=username).first()
        if user:
            new_doc = UserDocument(
                filename=filename,
                filepath="",  # Not storing the actual file
                status='analyzed',
                analysis_data=json.dumps(analysis),
                user_id=user.id
            )
            db.session.add(new_doc)
            db.session.commit()
    except Exception as e:
        print(f"Failed to store analysis: {str(e)}")
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
7. Be fair to both parties and avoid any bias
8. not provide any discriminatory remarks
9. not give or show any penalties if not mentioned in the request
10. not include any notes or disclaimers in the end, just return the clause content
11. not include any form of date or time in the clause content

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


@app.route('/api/chatbot', methods=['POST'])
def chatbot_response():
    if model is None:
        return jsonify({"error": "Model not loaded. Check server logs."}), 500
        
    data = request.json
    user_message = data.get('message', '').strip()
    username = data.get('username', 'guest')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        # Create a prompt that's optimized for quick responses
        prompt = f"""<s>[INST] You are LegalMind, an AI assistant specializing in Indian lease agreements and rental laws.
Respond to the user's query concisely (1-2 short paragraphs max) with accurate legal information.

User: {username}
Query: {user_message}

Guidelines:
1. Be precise and factual about Indian rental laws
2. Keep responses under 150 words
3. Use simple language (avoid complex legal jargon)
4. Format with clear line breaks for readability
5. If suggesting clauses, provide only the most relevant part
6. For complex questions, suggest consulting a lawyer
7. Never provide false or speculative information

Provide ONLY the response content (no prefixes or labels)[/INST]</s>
"""
        # Generate response with faster, lower-quality settings
        response = model(
            prompt,
            max_tokens=256,  # Keep responses short
            temperature=0.5,  # More deterministic
            top_p=0.85,
            repeat_penalty=1.1,
            echo=False,
            stop=["</s>"]  # Stop generation at end token
        )
        
        # Extract and clean the response
        generated_text = response["choices"][0]["text"].strip()
        
        # Post-processing for cleaner output
        generated_text = re.sub(r'\n+', '\n', generated_text)  # Remove extra newlines
        generated_text = re.sub(r'^\s*[\-\*]\s*', '', generated_text, flags=re.MULTILINE)  # Remove bullet points
        
        return jsonify({
            "success": True,
            "response": generated_text,
            "tokens_used": response["usage"]["total_tokens"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#default[To be removed]
@app.route('/')
def home():
    return "Hello World"


@app.route('/api/download/document/<int:doc_id>', methods=['GET'])
def download_document(doc_id):
    try:
        # Get username from request args instead of session
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "Username parameter required"}), 400
            
        # Verify user exists
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Get the document with ownership check
        document = UserDocument.query.filter_by(id=doc_id, user_id=user.id).first()
        if not document:
            return jsonify({"error": "Document not found or access denied"}), 404
            
        if not os.path.exists(document.filepath):
            return jsonify({"error": "Document file not found"}), 404
            
        return send_file(
            document.filepath,
            as_attachment=True,
            download_name=document.filename
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user/documents/<int:doc_id>', methods=['PUT'])
def update_document(doc_id):
    try:
        username = request.json.get('username')
        if not username:
            return jsonify({"error": "Username required"}), 400
            
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        document = UserDocument.query.filter_by(id=doc_id, user_id=user.id).first()
        if not document:
            return jsonify({"error": "Document not found or access denied"}), 404
            
        data = request.json
        if not data or 'filename' not in data:
            return jsonify({"error": "Filename is required"}), 400
            
        document.filename = data['filename']
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Document updated successfully",
            "document": document.to_json()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/user/documents/<int:doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    try:
        # Get username from request (support both JSON and form data)
        username = None
        if request.is_json:
            username = request.json.get('username')
        else:
            username = request.form.get('username')
        
        if not username:
            return jsonify({"error": "Username parameter required"}), 400

        # Verify user exists
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get the document with ownership check
        document = UserDocument.query.filter_by(id=doc_id, user_id=user.id).first()
        if not document:
            return jsonify({"error": "Document not found or access denied"}), 404

        # Delete the file if it exists
        file_deleted = False
        if document.filepath and os.path.exists(document.filepath):
            try:
                os.remove(document.filepath)
                file_deleted = True
            except Exception as e:
                current_app.logger.error(f"File deletion error: {str(e)}")

        # Delete from database
        db.session.delete(document)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Document deleted successfully",
            "file_deleted": file_deleted
        })

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Delete error: {str(e)}")
        return jsonify({"error": "Server error during deletion"}), 500