from models.Worker import Worker
from models.WorkerSkills import WorkerSkill
from extensions import db

class WorkerService:
    @staticmethod
    def register_worker(client_id, data):
        existing = Worker.query.filter_by(client_id=client_id).first()
        if existing:
            return {"error": "Worker already registered"}, 400

        worker = Worker(
            client_id=client_id,
            bio=data["bio"],
            location=data["location"],
            hourly_rate=data["hourly_rate"],
            is_approved=False,
            status="available"
        )
        db.session.add(worker)
        db.session.commit()
        return {"message": "Worker profile created"}, 201

    @staticmethod
    def get_profile(worker_id):
        worker = Worker.query.get(worker_id)
        if not worker:
            return {"error": "Worker not found"}, 404
        return {
            "worker_id": worker.worker_id,
            "bio": worker.bio,
            "location": worker.location,
            "hourly_rate": worker.hourly_rate,
            "is_approved": worker.is_approved
        }, 200

    @staticmethod
    def update_profile(worker_id, data):
        worker = Worker.query.get(worker_id)
        if not worker:
            return {"error": "Worker not found"}, 404

        for key, value in data.items():
            setattr(worker, key, value)
        db.session.commit()
        return {"message": "Worker profile updated"}, 200

    @staticmethod
    def deactivate(worker_id):
        worker = Worker.query.get(worker_id)
        if not worker:
            return {"error": "Worker not found"}, 404
        db.session.delete(worker)
        db.session.commit()
        return {"message": "Worker account deleted"}, 200

    @staticmethod
    def add_skills(worker_id, skills):
        for skill_id in skills:
            exists = WorkerSkill.query.filter_by(worker_id=worker_id, skill_id=skill_id).first()
            if not exists:
                db.session.add(WorkerSkill(worker_id=worker_id, skill_id=skill_id))
        db.session.commit()
        return {"message": "Skills added"}, 200

    @staticmethod
    def get_skills(worker_id):
        skills = WorkerSkill.query.filter_by(worker_id=worker_id).all()
        return {"skills": [s.skill_id for s in skills]}, 200

    @staticmethod
    def remove_skill(worker_id, skill_id):
        skill = WorkerSkill.query.filter_by(worker_id=worker_id, skill_id=skill_id).first()
        if not skill:
            return {"error": "Skill not found"}, 404
        db.session.delete(skill)
        db.session.commit()
        return {"message": "Skill removed"}, 200

