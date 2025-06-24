from extensions import db
from enum import Enum
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class WorkerStatus(Enum):
    AVAILABLE = 'available'
    BUSY = 'busy'
    OFFLINE = 'offline'

class Worker(db.Model, SerializerMixin):
    __tablename__ = 'workers'
    
    worker_id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    
    bio = db.Column(db.Text, nullable=True)
    hourly_rate = db.Column(db.Float, nullable=False, default=0.0)
    status = db.Column(db.Enum(WorkerStatus), nullable=False, default=WorkerStatus.AVAILABLE)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False) 

    #relationships
    client = db.relationship('Client', back_populates='workers')
    jobs = db.relationship('Job', back_populates='worker', cascade='all, delete-orphan')
    portfolio = db.relationship('WorkerPortfolio', back_populates='worker', cascade='all, delete-orphan')
    certifications = db.relationship('Certification', back_populates='worker', cascade='all, delete-orphan')
    skills = db.relationship('Skill',secondary='worker_skills', back_populates='workers')

    serialize_rules = ('-client.hashed_password', )

    def __repr__(self):
        return f'<Worker {self.worker_id}>'