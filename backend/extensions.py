#imports all flask extenstions that will be used to avoid circular imports
from flask_sqlalchemy import SQLAlchemy #ORM for the database
from flask_bcrypt import Bcrypt         #for hashing passwords
from flask_cors import CORS             #allows frontend to call backend

db = SQLAlchemy()
bcrypt = Bcrypt()
cors = CORS()
