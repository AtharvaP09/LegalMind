import fitz  # PyMuPDF
import docx
import os
import re
import json
from fpdf import FPDF  # Import FPDF for PDF report generation

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    try:
        doc = fitz.open(file_path)
        text = "\n".join([page.get_text() for page in doc])
        return text.strip()
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"

def extract_text_from_docx(file_path):
    """Extract text from a DOCX file."""
    try:
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        return f"Error extracting text from DOCX: {str(e)}"

def extract_text(file_path):
    """Determine file type and extract text accordingly."""
    if not os.path.exists(file_path):
        return "Error: File not found!"
    
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    else:
        return "Unsupported file format! Please upload a PDF or DOCX file."
    
def preprocess_text(text):
    """Clean and preprocess extracted text."""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    sentences = text.split(".")
    return [sentence.strip() for sentence in sentences if sentence.strip()]

def extract_clauses(text_list):
    """Extract key clauses like duration, rent, and deposit."""
    clauses = {
        "duration": None,
        "rent": None,
        "deposit": None,
        "termination": None
    }
    
    for sentence in text_list:
        if "duration" in sentence or "period" in sentence:
            clauses["duration"] = sentence
        elif "rent" in sentence and "rs" in sentence:
            clauses["rent"] = sentence
        elif "deposit" in sentence or "security deposit" in sentence:
            clauses["deposit"] = sentence
        elif "termination" in sentence or "cancel" in sentence:
            clauses["termination"] = sentence
    
    return clauses

def save_to_json(clauses, output_filename="extracted_clauses.json"):
    """Save extracted clauses to a JSON file."""
    try:
        with open(output_filename, "w", encoding="utf-8") as json_file:
            json.dump(clauses, json_file, indent=4, ensure_ascii=False)
        
        return os.path.abspath(output_filename)
    except Exception as e:
        return f"Error saving JSON file: {str(e)}"

def save_to_pdf(clauses, output_filename="lease_report.pdf"):
    """Save extracted clauses to a PDF report."""
    try:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", style='', size=12)
        
        pdf.cell(200, 10, "Lease Agreement Summary", ln=True, align="C")
        pdf.ln(10)
        
        for key, value in clauses.items():
            pdf.set_font("Arial", style='B', size=12)
            pdf.cell(0, 10, f"{key.capitalize()}:", ln=True)
            pdf.set_font("Arial", style='', size=12)
            pdf.multi_cell(0, 10, value if value else "Not Found")
            pdf.ln(5)
        
        pdf.output(output_filename)
        return os.path.abspath(output_filename)
    except Exception as e:
        return f"Error generating PDF: {str(e)}"

def process_lease_document(file_path):
    """Main function to extract, process, and save lease document data."""
    extracted_text = extract_text(file_path)
    if "Error" in extracted_text:
        return extracted_text
    
    cleaned_text = preprocess_text(extracted_text)
    clauses = extract_clauses(cleaned_text)
    
    json_path = save_to_json(clauses)
    pdf_path = save_to_pdf(clauses)
    
    return {
        "Extracted Clauses": clauses,
        "JSON File": json_path,
        "PDF Report": pdf_path
    }
