"""#Admin access only
from extensions import db
from sqlalchemy_serializer import SerializerMixin

class Skill(db.Model, SerializerMixin):
    __tablename__ = "skill"
    
    skill_id = db.Column(db.Integer, primary_key=True)
    skill_name = db.Column(db.String(100), nullable=False, unique=True)
    category = db.Column(db.String(100))

    #many-to-many relationship with worker
    workers = db.relationship("Worker", secondary="worker_skills", back_populates="skills")
    jobs = db.relationship("Job", back_populates="skill")

    def __repr__(self):
        return f"<Skill {self.skill_name}>"
    
    def to_dict(self):
        return {
            "skill_id": self.skill_id,
            "skill_name": self.skill_name
        } """

from extensions import db
from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy_serializer import SerializerMixin
from models.association import worker_skills


class Skill(db.Model, SerializerMixin):
    __tablename__ = 'skill'

    skill_id: Mapped[int] = mapped_column(primary_key=True)
    skill_name: Mapped[str] = mapped_column(nullable=False)
    category: Mapped[str] = mapped_column(nullable=True)

    workers: Mapped[List["Worker"]] = relationship(
        "Worker",
        secondary=worker_skills,
        back_populates="skills"
    )

    jobs = relationship("Job", back_populates="skill", cascade="all, delete-orphan")
    #workers = db.relationship("Worker", secondary=worker_skills, back_populates="skills")


    def __repr__(self):
        return f'<Skill {self.skill_name}>'

