#this is an association table for many-to-many relationship between Workers and Skills
#Worker A can have many Skills, and Skill Z can be associated with many Workers
from extensions import db
from sqlalchemy_serializer import SerializerMixin

class WorkerSkill(db.Model, SerializerMixin):
    __tablename__ = 'worker_skills'

    worker_skill_id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.worker_id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skill.skill_id'), nullable=False)

    def __repr__(self):
        return f'<WorkerSkill {self.worker_id} - {self.skill_id}>'