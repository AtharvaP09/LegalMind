import sqlite3
import json
import os

db_path = 'instance/database.db' if os.path.exists('instance/database.db') else 'database.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT analysis_data FROM user_document WHERE status='analyzed'")
rows = cursor.fetchall()
for r in rows:
    try:
        data = json.loads(r[0])
        print("Keys:", data.keys())
        print("Chat Messages Length:", len(data.get('chatMessages', [])))
        print("Chat Messages:", data.get('chatMessages'))
    except Exception as e:
        print("Error parsing:", e)
conn.close()
