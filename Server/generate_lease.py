from docx import Document
from docx.shared import Pt
import os

def generate_lease_doc(data):
    template_path = "templates/lease_template.docx"
    doc = Document(template_path)

    # Replace placeholders
    for para in doc.paragraphs:
        for key, value in data.items():
            if f'{{{key}}}' in para.text:  # Check if placeholder exists
                para.text = para.text.replace(f'{{{key}}}', str(value))
    
    # Set font to Cambria for entire document
    for para in doc.paragraphs:
        for run in para.runs:
            run.font.name = 'Cambria'
    
    # Also set font for tables if present
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    for run in para.runs:
                        run.font.name = 'Cambria'
                        run.font.size = Pt(12)  # Optional: set standard font size

    # Ensure output directory exists
    os.makedirs('generated', exist_ok=True)
    
    output_path = "generated/generated_lease.docx"
    doc.save(output_path)
    
    return "Done, Template Updated with Cambria Font"