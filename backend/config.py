import os
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://hireuser:securepassword@localhost/hireherhands'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False #disables track modifications to save resources
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')
    JWT_SECRET_KEY = 'supersecretkey'
    ALLOWED_ADMIN_EMAILS = os.getenv('ALLOWED_ADMIN_EMAILS', '').split(',')
