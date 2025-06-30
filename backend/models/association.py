from extensions import db

worker_skills = db.Table(
    "worker_skills",
    db.Column("worker_id", db.Integer, db.ForeignKey("workers.worker_id"), primary_key=True),
    db.Column("skill_id", db.Integer, db.ForeignKey("skill.skill_id"), primary_key=True)
)
