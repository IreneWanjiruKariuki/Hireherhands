from extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class Worker(db.Model, SerializerMixin):
    __tablename__ = 'workers'
    
    worker_id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    hashed_password = db.Column(db.String(128), nullable=False)
    bio= db.Column(db.Text, nullable=True)
    hourly_rate = db.Column(db.Float, nullable=False, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    #exclude hashed_password from serialization
    serialize_rules = ('-hashed_password',)

    #relationships
    jobs = db.relationship('Job', backref='worker', lazy=True) #one worker can have many jobs
    ratings = db.relationship('Rating', backref='worker', lazy=True) #one worker can be rated by many clients
    worker_skills = db.relationship('WorkerSkill', backref='worker', lazy=True) #one worker can have many skills
    worker_portfolio = db.relationship('WorkerPortfolio', backref='worker', lazy=True) #one worker can have many portfolio items
    certifications = db.relationship('Certification', backref='worker', lazy=True) #one worker can have many certifications

    def __repr__(self):
        return f'<Worker {self.fullname}>'