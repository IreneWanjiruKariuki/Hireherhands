from extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class Job(db.Model, SerializerMixin):
    __tablename__ = 'jobs'
    
    job_id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.worker_id'), nullable=True)#this will be until the worker accepts the job
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    budget = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False)  # e.g., 'open', 'in_progress', 'completed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Job {self.title} by Client {self.client_id}>'
