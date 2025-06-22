import os
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key') #secret key for session management
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///app.db') #database URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False #disables track modifications to save resources
