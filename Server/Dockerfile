FROM python:3.11-slim

# Install system dependencies with build tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# First copy only requirements to leverage Docker cache
COPY requirements.txt .

# Install with specific llama_cpp_python wheel for Linux
RUN pip install --no-cache-dir \
    --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cpu \
    llama-cpp-python==0.2.23 \
    && pip install --no-cache-dir -r requirements.txt

# Clean up build tools (optional)
RUN apt-get remove -y build-essential cmake git && \
    apt-get autoremove -y

# Copy application code
COPY . .

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "app:app"]