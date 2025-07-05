from models.Skill import Skill
from extensions import db

class SkillService:
    @staticmethod
    def get_all_skills():
        skills = Skill.query.all()
        return {
            "skills": [
                {
                    "skill_id": skill.skill_id,
                    "skill_name": skill.skill_name,
                } for skill in skills
                ]
            }, 200

    @staticmethod
    def get_skill_by_id(skill_id):
        skill = Skill.query.get(skill_id)
        if not skill:
            return {"error": "Skill not found"}, 404
        return {"skill": skill.serialize()}, 200

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
