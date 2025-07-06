import enum
from extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

#job status
class JobStatus(enum.Enum):
    OPEN = 'open'
    REQUESTED = 'requested'
    IN_PROGRESS = 'in_progress'
    WORKER_COMPLETED = 'worker_completed'
    COMPLETED = 'completed'

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
    status = db.Column(db.Enum(JobStatus), nullable=False, default=JobStatus.OPEN)
    skill_name = db.Column(db.String(100), nullable=False)  # Optional field to store skill name
    duration = db.Column(db.String(100), nullable=True)
    worker_completion_confirmed = db.Column(db.Boolean, default=False)
    client_completion_confirmed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    #relationships
    worker = db.relationship('Worker', back_populates='jobs')
    client = db.relationship('Client', back_populates='jobs')
    skill = db.relationship('Skill', back_populates='jobs')
    messages = db.relationship('Message', back_populates='job', cascade='all, delete-orphan')
    ratings = db.relationship('Rating', back_populates='job', cascade='all, delete-orphan')
    ratings = db.relationship('Rating', back_populates='job', cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Job {self.skill_id} by Client {self.client_id}>'
    def to_dict(self):
        return {
            "job_id": self.job_id,
            "title": self.skill_name,
            "description": self.description,
            "budget": self.budget,
            "status": self.status.value,
            "client_id": self.client_id,
            "client_name": self.client.fullname if self.client else None,
            "worker_id": self.worker_id,
            "scheduled_date": self.scheduled_date.isoformat() if self.scheduled_date else None,
            "scheduled_time": self.scheduled_time.strftime("%H:%M") if self.scheduled_time else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "skill_name": self.skill.skill_name if self.skill else None
    }
