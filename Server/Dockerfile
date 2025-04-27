FROM python:3.11-slim

# 1. Install system dependencies in one layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Copy requirements first for caching
COPY requirements.txt .

# 3. Install PyMuPDF FIRST with explicit version
RUN pip install --no-cache-dir pymupdf==1.23.5 --no-build-isolation && \
    pip install --no-cache-dir -r requirements.txt

# 4. Verify installation
RUN python -c "import pymupdf; print(f'PyMuPDF version: {pymupdf.__version__}')"

# 5. Copy application code
COPY . .

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "app:app"]