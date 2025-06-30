from extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'
    
    client_id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    hashed_password = db.Column(db.Text, nullable=False)  # No size limit
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_deleted = db.Column(db.Boolean, default=False) 

    #relationships
    workers = db.relationship('Worker', back_populates='client', uselist=False)
    jobs = db.relationship('Job', back_populates='client', cascade='all, delete-orphan')

    #exclude hashed_password from serialization
    serialize_rules = ('-hashed_password', '-workers.client',)
    
    def __repr__(self):
        return f'<Client {self.fullname}>'
    
