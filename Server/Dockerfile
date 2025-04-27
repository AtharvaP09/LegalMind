FROM python:3.11-slim

# Install system dependencies for llama_cpp_python
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# First copy only requirements to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies with pre-built wheels for llama_cpp_python
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "app:app"]