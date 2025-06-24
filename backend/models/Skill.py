#Admin access only
from extensions import db
from sqlalchemy_serializer import SerializerMixin

class Skill(db.Model, SerializerMixin):
    __tablename__ = "skill"
    
    skill_id = db.Column(db.Integer, primary_key=True)
    skill_name = db.Column(db.String(100), nullable=False, unique=True)

    #many-to-many relationship with worker
    workers = db.relationship("Worker", secondary="worker_skills", back_populates="skills")
    jobs = db.relationship("Job", back_populates="skill")

    def __repr__(self):
        return f"<Skill {self.skill_name}>"