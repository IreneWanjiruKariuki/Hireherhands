from models.Skill import Skill
from extensions import db

class SkillService:
 
    @staticmethod
    def get_all_skills(include_inactive=False):
        query = Skill.query
        if not include_inactive:
            query = query.filter_by(is_active=True)
        skills = query.all()
        return {
            "skills": [
                 {
                    "skill_id": skill.skill_id,
                    "skill_name": skill.skill_name,
                    "is_active": skill.is_active
                } for skill in skills
            ]
        }, 200

    @staticmethod
    def get_workers_by_skill(skill_id):
        skill = Skill.query.get(skill_id)
        if not skill:
            return {"error": "Skill not found"}, 404
        workers = skill.workers
        return {
            "workers": [{
                "worker_id": w.worker_id,
                "fullname": w.client.fullname,
                "email": w.client.email,
                "phone": w.client.phone,
                "location": w.location,
                "is_approved": w.is_approved,
            } for w in workers]
        }, 200


    @staticmethod
    def get_skill_by_name(name):
        skill = Skill.query.filter_by(skill_name=name).first()
        if not skill:
            return {"error": "Skill not found"}, 404
        return {"skill": skill.serialize()}, 200

    @staticmethod
    def create_skill(name):
        name = name.strip().lower()
        if not name:
            return {"error": "Skill name is required"}, 400
        if Skill.query.filter_by(skill_name=name).first():
            return {"error": "Skill already exists"}, 400
        skill = Skill(skill_name=name)
        db.session.add(skill)
        db.session.commit()
        return {"message": "Skill created", "skill": skill.to_dict()}, 201

    @staticmethod
    def update_skill(skill_id, name):
        skill = Skill.query.get(skill_id)
        if not skill:
            return {"error": "Skill not found"}, 404
        if not name:
            return {"error": "Skill name is required"}, 400
        skill.skill_name = name.strip().lower()
        db.session.commit()
        return {"message": "Skill updated", "skill": skill.to_dict()}, 200

    @staticmethod
    def delete_skill(skill_id):
        skill = Skill.query.get(skill_id)
        if not skill:
            return {"error": "Skill not found"}, 404
        db.session.delete(skill)
        db.session.commit()
        return {"message": "Skill deleted"}, 200

    @staticmethod
    def get_jobs_by_skill(skill_id):
        skill = Skill.query.get(skill_id)
        if not skill:
            return {"error": "Skill not found"}, 404
        jobs = skill.jobs
        return {
            "jobs": [{
                "job_id": j.job_id,
                "description": j.description,
                "status": j.status.value,
                "budget": j.budget,
                "client_name": j.client.fullname if j.client else None,
                "worker_name": j.worker.client.fullname if j.worker and j.worker.client else None,
                "created_at": j.created_at.isoformat() if j.created_at else None,
            } for j in jobs]
        }, 200

    @staticmethod
    def toggle_skill_status(skill_id):
        skill = Skill.query.get(skill_id)
        if not skill:
            return {"error": "Skill not found"}, 404
        skill.is_active = not skill.is_active
        db.session.commit()
        state = "deactivated" if not skill.is_active else "reactivated"
        return {"message": f"Skill {state} successfully."}, 200


