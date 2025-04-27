FROM python:3.11-slim

WORKDIR /app

# Copy requirements from the Server directory
COPY ./Server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend files from Server directory
COPY ./Server/ .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]