import sqlite3
import os

db_path = 'instance/database.db' if os.path.exists('instance/database.db') else 'database.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Tables:", cursor.fetchall())

try:
    cursor.execute('ALTER TABLE user_document ADD COLUMN analysis_data TEXT')
    print('Successfully added analysis_data to user_document')
except Exception as e:
    print(f"Error altering user_document: {e}")

conn.commit()
conn.close()
