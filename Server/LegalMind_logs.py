import logging
import os

# Ensure logs folder exists
os.makedirs('logs', exist_ok=True)

# Create a dedicated logger (not the root logger)
app_logger = logging.getLogger('LegalMind')
app_logger.setLevel(logging.INFO)

# Log to a file
file_handler = logging.FileHandler('logs/app.log')
file_handler.setLevel(logging.INFO)

# Format: [timestamp] user_id=... | action=... | document=...
# Update the formatter to indicate hash storage
formatter = logging.Formatter(
    '[%(asctime)s] user_id=%(user_id)s | action=%(action)s | document_hash=%(document)s',  # Changed key name
    datefmt='%Y-%m-%d %H:%M:%S'
)
file_handler.setFormatter(formatter)

# Attach the handler
app_logger.addHandler(file_handler)

def log_event(user_id, action, document):
    """Log an event with user_id, action, and document details."""
    extra = {
        'user_id': user_id,
        'action': action,
        'document': document
    }
    app_logger.info('Event logged', extra=extra)