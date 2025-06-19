from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from services.Admin import AdminService
from marshmallow import ValidationError
from models.schemas.Auth import SignupSchema, LoginSchema

signup_schema = SignupSchema()
login_schema = LoginSchema()

def admin_only():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return {"error": "Admin access only"}, 403
    return None

class AdminRegisterResource(Resource):
    def post(self):
        try:
            data = signup_schema.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400
        return AdminService.register_admin(data)

class AdminLoginResource(Resource):
    def post(self):
        try:
            data = login_schema.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400
        return AdminService.login_admin(data)

class AdminClientsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminService.get_all_clients()

class AdminWorkersResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminService.get_all_workers()

class AdminSkillsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminService.get_all_skills()

class AdminAddSkillResource(Resource):
    @jwt_required()
    def post(self):
        check = admin_only()
        if check: return check
        name = request.get_json().get("name")
        return AdminService.create_skill(name)

class AdminDeleteSkillResource(Resource):
    @jwt_required()
    def delete(self, skill_id):
        check = admin_only()
        if check: return check
        return AdminService.delete_skill(skill_id)

class AdminWorkerApplicationsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminService.get_all_worker_applications()

class AdminApproveRejectWorkerResource(Resource):
    @jwt_required()
    def post(self, worker_id):
        check = admin_only()
        if check: return check
        action = request.get_json().get("action")
        return AdminService.approve_or_reject_worker(worker_id, action)

class AdminJobsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminService.get_all_jobs()

class AdminMessagesResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminService.get_all_messages()

class AdminRatingsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminService.get_all_ratings()
