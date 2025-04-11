import fitz  # PyMuPDF
import docx
import os
import re
import json
from fpdf import FPDF

def extract_text_from_pdf(file_path):
    try:
        doc = fitz.open(file_path)
        return "\n".join([page.get_text() for page in doc]).strip()
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"

def extract_text_from_docx(file_path):
    try:
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs]).strip()
    except Exception as e:
        return f"Error extracting text from DOCX: {str(e)}"

def extract_text(file_path):
    if not os.path.exists(file_path):
        return "Error: File not found!"
    
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    else:
        return "Unsupported file format! Please upload a PDF or DOCX file."

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    return text

def extract_clauses(text):
    clauses = {"duration": None, "rent": None, "deposit": None, "termination": None}
    
    # Extract date-based duration
    date_pattern = r"(\d{1,2}[a-z]{0,2}\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s\d{4})"
    dates = re.findall(date_pattern, text)
    if len(dates) >= 2:
        clauses["duration"] = f"From {dates[0]} to {dates[1]}"
    
    # Extract rent (if 'rent' appears in a sentence)
    rent_match = re.search(r"rent[^.]*?([0-9,]+)", text)
    if rent_match:
        clauses["rent"] = f"Rent: {rent_match.group(1)}"
    
    # Extract deposit
    deposit_match = re.search(r"(deposit|security deposit)[^.]*?(\d{1,})", text)
    if deposit_match:
        clauses["deposit"] = f"Deposit: {deposit_match.group(2)}"
    
    # Extract termination
    termination_match = re.search(r"(terminates|termination|cancel)[^.]*", text)
    if termination_match:
        clauses["termination"] = termination_match.group(0).strip()
    
    return clauses

def save_to_json(clauses, output_filename="extracted_clauses.json"):
    try:
        with open(output_filename, "w", encoding="utf-8") as json_file:
            json.dump(clauses, json_file, indent=4, ensure_ascii=False)
        return os.path.abspath(output_filename)
    except Exception as e:
        return f"Error saving JSON file: {str(e)}"

def process_lease_document(file_path):
    extracted_text = extract_text(file_path)
    if "Error" in extracted_text:
        return extracted_text
    
    cleaned_text = preprocess_text(extracted_text)
    clauses = extract_clauses(cleaned_text)
    json_path = save_to_json(clauses)
    
    return {"Extracted Clauses": clauses, "JSON File": json_path}
