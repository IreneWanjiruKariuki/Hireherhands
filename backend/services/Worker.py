from models.Worker import Worker
from models.Client import Client
from models.Skill import Skill
#from models.association import WorkerSkill

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
            id_number=data["id_number"],
            is_approved=False
        )

        db.session.add(worker) 
        db.session.flush()

        skills = data.get("skills", [])
        for skill_id in skills:
            skill = Skill.query.get(skill_id)
            if skill:
                worker.skills.append(skill) 
               
        db.session.commit()
        return {"message": "Worker profile created and skills attached"}, 201

    @staticmethod
    def get_profile(worker_id):
        worker = Worker.query.filter_by(worker_id=worker_id, is_deleted=False).first()
        if not worker:
            return {"error": "Worker not found"}, 404
        if not worker.is_approved:
            return {"error": "Your application is still pending approval."}, 403
        client = Client.query.get(worker.client_id)
        if not client:
            return {"error": "Client linked to worker not found"}, 404
        return {
            "worker_id": worker.worker_id,
            "fullname": client.fullname,
            "email": client.email,
            "phone": client.phone,
            "bio": worker.bio,
            "location": worker.location,
            "hourly_rate": worker.hourly_rate,
            "is_approved": worker.is_approved
        }, 200


    @staticmethod
    def update_profile(worker_id, data):
        worker = Worker.query.filter_by(worker_id=worker_id, is_deleted=False).first()
        if not worker:
            return {"error": "Worker not found"}, 404

        for key, value in data.items():
            setattr(worker, key, value)
        db.session.commit()
        return {"message": "Worker profile updated"}, 200

    @staticmethod
    def deactivate(worker_id):
        worker = Worker.query.filter_by(worker_id=worker_id, is_deleted=False).first()
        if not worker:
            return {"error": "Worker not found"}, 404
        worker.is_deleted = True
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
        skill_ids = [s.skill_id for s in skills]
        skills = Skill.query.filter(Skill.skill_id.in_(skill_ids)).all()
        return {
            "skills": [{"skill_id": s.skill_id, "name": s.name} for s in skills]
        }, 200

    @staticmethod
    def remove_skill(worker_id, skill_id):
        skill = WorkerSkill.query.filter_by(worker_id=worker_id, skill_id=skill_id).first()
        if not skill:
            return {"error": "Skill not found"}, 404
        db.session.delete(skill)
        db.session.commit()
        return {"message": "Skill removed"}, 200

