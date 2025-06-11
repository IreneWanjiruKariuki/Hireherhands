from extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'
    
    client_id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hashed_password = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    #exclude hashed_password from serialization
    serialize_rules = ('-hashed_password',)
    
    #relationships
    jobs = db.relationship('Job', backref='client', lazy=True) #one client can post many jobs
    payments = db.relationship('Payment', backref='client', lazy=True) #one client can have many payments
    ratings = db.relationship('Rating', backref='client', lazy=True) #one client can have many ratings

    def __repr__(self):
        return f'<Client {self.fullname}>'
