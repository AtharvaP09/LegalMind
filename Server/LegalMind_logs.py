# import logging  # Import the logging module
# import os       # Import os module to handle file path and size operations

# # Set up basic logging configuration
# logging.basicConfig(
#     level=logging.DEBUG,                      # Set the logging level to DEBUG (logs all levels DEBUG and above)
#     filename="documents_upload.log",          # Name of the log file where logs will be saved
#     filemode="a",                             # "a" means append mode – logs will be added at the end of the file
#     format="%(asctime)s - %(levelname)s - %(message)s"  # Format for each log message
# )

# def log_document_upload(file_path, user_id=None):
#     """
#     Logs information about a document uploaded by a user.
#     file_path: full path to the saved document
#     user_id: optional user identifier
#     """
#     try:
#         file_name = os.path.basename(file_path)         # Extract just the file name from the full file path
#         file_size = os.path.getsize(file_path)          # Get the size of the file in bytes

#         # Prepare the log message with file name and size
#         message = f"Document uploaded: {file_name}, Size: {file_size} bytes"

#         # If user_id is provided, add it to the log message
#         if user_id:
#             message += f", Uploaded by User ID: {user_id}"

#         logging.info(message)  # Log the prepared message at INFO level

#     except Exception as e:
#         # If something goes wrong (e.g., file doesn't exist), log the error with exception details
#         logging.error(f"Error logging document upload: {e}")

# logger.py
import logging
import os

# Ensure logs folder exists
os.makedirs('logs', exist_ok=True)

# Configure logging
logging.basicConfig(
    filename='logs/app.log',
    level=logging.INFO,
    format='[%(asctime)s] user_id=%(user_id)s | action=%(action)s | document=%(document)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Helper function to log events
def log_event(user_id, action, document):
    extra = {
        'user_id': user_id,
        'action': action,
        'document': document
    }
    logging.info('', extra=extra)

