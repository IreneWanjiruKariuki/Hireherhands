#imports all flask extenstions that will be used to avoid circular imports
from flask_sqlalchemy import SQLAlchemy #ORM for the database
from flask_bcrypt import Bcrypt         #for hashing passwords
from flask_cors import CORS             #allows frontend to call backend
from flask_migrate import Migrate       #for database migrations
from flask_jwt_extended import JWTManager #for JWT authentication

db = SQLAlchemy()
bcrypt = Bcrypt()
cors = CORS()
migrate = Migrate()
jwt = JWTManager()