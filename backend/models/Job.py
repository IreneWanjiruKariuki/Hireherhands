from extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class Job(db.Model, SerializerMixin):
    __tablename__ = 'jobs'
    
    job_id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.worker_id'), nullable=True)#this will be until the worker accepts the job
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skill.skill_id'), nullable=False)

    description = db.Column(db.Text, nullable=False)
    budget = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(255), nullable=True)
    scheduled_date = db.Column(db.Date, nullable=True)  # Date when the job is scheduled to start
    scheduled_time = db.Column(db.Time, nullable=True)  # Time when the job is scheduled to start
    status = db.Column(db.String(50), nullable=False)  # e.g., 'open', 'in_progress', 'completed'
    worker_completion_confirmed = db.Column(db.Boolean, default=False)
    client_completion_confirmed = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    #relationships
    worker = db.relationship('Worker', back_populates='jobs')
    client = db.relationship('Client', back_populates='jobs')
    skill = db.relationship('Skill', back_populates='jobs')
    messages = db.relationship('Message', back_populates='job', cascade='all, delete-orphan')
    ratings = db.relationship('Rating', back_populates='job', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Job {self.skill_id} by Client {self.client_id}>'
