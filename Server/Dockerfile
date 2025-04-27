FROM python:3.11-slim

# Install all system dependencies in one layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    git \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# First copy only requirements to leverage Docker cache
COPY requirements.txt .

# Install llama-cpp-python with pre-built wheel
RUN pip install --no-cache-dir \
    --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cpu \
    llama-cpp-python==0.2.23

# Install PyMuPDF and other requirements
RUN pip install --no-cache-dir pymupdf==1.23.5 && \
    pip install --no-cache-dir -r requirements.txt

# Clean up build tools to reduce image size
RUN apt-get remove -y build-essential cmake git && \
    apt-get autoremove -y && \
    rm -rf /var/cache/apt/archives/*

# Copy application code
COPY . .

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "app:app"]