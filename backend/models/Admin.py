from extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'
    
    admin_id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hashed_password = db.Column(db.String(128), nullable=False)
    
    #exclude hashed_password from serialization
    serialize_rules = ('-hashed_password',)

    def __repr__(self):
        return f'<Admin {self.fullname}>'
