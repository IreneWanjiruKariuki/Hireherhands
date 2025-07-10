import os
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://hireuser:securepassword@172.20.233.224/hireherhands'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False 
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')
    JWT_SECRET_KEY = 'supersecretkey'
   
    ALLOWED_ADMIN_EMAILS = os.getenv("ALLOWED_ADMIN_EMAILS").split(",")

