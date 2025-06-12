from extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class Worker(db.Model, SerializerMixin):
    __tablename__ = 'workers'
    
    worker_id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    
    bio = db.Column(db.Text, nullable=True)
    hashed_password = db.Column(db.String(128), nullable=False)
    hourly_rate = db.Column(db.Float, nullable=False, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    #exclude hashed_password from serialization
    serialize_rules = ('-hashed_password',)

    def __repr__(self):
        return f'<Worker {self.fullname}>'