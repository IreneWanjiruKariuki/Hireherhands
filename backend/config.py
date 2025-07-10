import os
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://hireuser:securepassword@172.20.233.224/hireherhands'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False 
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')
    JWT_SECRET_KEY = 'supersecretkey'
<<<<<<< HEAD
    ALLOWED_ADMIN_EMAILS = os.getenv('ALLOWED_ADMIN_EMAILS', '').split(',')
=======
   
    ALLOWED_ADMIN_EMAILS = os.getenv("ALLOWED_ADMIN_EMAILS").split(",")
>>>>>>> d692a4959ece4d5f75023d05e2776f44bf0be2d5

