from flask_restful import Resource, request
from flask_jwt_extended import jwt_required, get_jwt
from services.Skill import SkillService

def admin_only():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return {"error": "Admin access only"}, 403
    return None

class PublicSkillsResource(Resource):
    def get(self):
        return SkillService.get_all_skills()

