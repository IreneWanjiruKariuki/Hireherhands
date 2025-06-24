from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from services.Skill import SkillService

def admin_only():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return {"error": "Admin access only"}, 403

class AdminSkillsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return SkillService.get_all_skills()

class AdminAddSkillResource(Resource):
    @jwt_required()
    def post(self):
        check = admin_only()
        if check: return check
        name = request.get_json().get("name")
        return SkillService.create_skill(name)

class AdminDeleteSkillResource(Resource):
    @jwt_required()
    def delete(self, skill_id):
        check = admin_only()
        if check: return check
        return SkillService.delete_skill(skill_id)
