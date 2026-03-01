import os
import sys

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import app, db, bcrypt

with app.app_context():
    from models import User, UserDocument
    print("Dropping all existing database tables...")
    db.drop_all()
    
    print("Recreating database tables...")
    db.create_all()
    
    print("Provisioning initial admin user...")
    hashed_password = bcrypt.generate_password_hash('admin123').decode('utf-8')
    admin_user = User(
        username='admin',
        email='admin@legalmind.com',
        password=hashed_password,
        is_admin=True
    )
    
    db.session.add(admin_user)
    db.session.commit()
    
    print("Admin user created successfully!")
    print("Username: admin")
    print("Email: admin@legalmind.com")
    print("Password: admin123")    
    db.session.add(admin_user)
    db.session.commit()
    
    print("Admin user created successfully!")
    print("Username: admin")
    print("Email: admin@legalmind.com")
    print("Password: admin123")
