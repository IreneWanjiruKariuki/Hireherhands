from models.Skill import Skill
from extensions import db

class AdminSkillService:
    @staticmethod
    def get_all_skills():
        skills = Skill.query.all()
        return {"skills": [skill.to_dict() for skill in skills]}, 200

    @staticmethod
    def create_skill(name):
        if not name:
            return {"error": "Skill name is required"}, 400

        if Skill.query.filter_by(skill_name=name).first():
            return {"error": "Skill already exists"}, 400

        new_skill = Skill(skill_name=name)
        db.session.add(new_skill)
        db.session.commit()

        return {"message": "Skill created", "skill": new_skill.to_dict()}, 201

    @staticmethod
    def delete_skill(skill_id):
        skill = Skill.query.get(skill_id)
        if not skill:
            return {"error": "Skill not found"}, 404

        db.session.delete(skill)
        db.session.commit()

        return {"message": "Skill deleted"}, 200
