FROM python:3.11-slim

# 1. Install ALL required system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Copy requirements first for caching
COPY requirements.txt .

# 3. Install PyMuPDF with NO dependencies first
RUN pip install --no-cache-dir --no-deps pymupdf==1.23.5

# 4. Then install all other requirements
RUN pip install --no-cache-dir -r requirements.txt

# 5. Verify installation
RUN python -c "import pymupdf; print(f'Successfully imported PyMuPDF version {pymupdf.__version__}')"

# 6. Copy application code
COPY . .

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "app:app"]