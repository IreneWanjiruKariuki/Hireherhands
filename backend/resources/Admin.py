from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from services.Skill import SkillService
from services.AdminClientService import AdminClientService
from services.AdminWorkerService import AdminWorkerService
from services.AdminJobService import AdminJobService
from services.AdminMessageService import AdminMessageService
from services.AdminRatingService import AdminRatingService
from models.Message import Message  
from marshmallow import ValidationError
from models.schemas.Auth import SignupSchema, LoginSchema

signup_schema = SignupSchema()
login_schema = LoginSchema()

# Admin role check helper
def admin_only():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return {"error": "Admin access only"}, 403
    return None

# ADMIN CLIENTS
class AdminClientsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminClientService.get_all_clients()

# ADMIN WORKERS
class AdminWorkersResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminWorkerService.get_all_workers()

class AdminWorkerApplicationsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminWorkerService.get_all_worker_applications()

class AdminApproveRejectWorkerResource(Resource):
    @jwt_required()
    def post(self, worker_id):
        check = admin_only()
        if check: return check
        action = request.get_json().get("action")
        return AdminWorkerService.approve_or_reject_worker(worker_id, action)

class AdminVerifyWorkerResource(Resource):
    @jwt_required()
    def post(self, worker_id):
        check = admin_only()
        if check: return check
        return AdminWorkerService.verify_worker(worker_id)

# ADMIN SKILLS
class AdminSkillsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return SkillService.get_all_skills()

    @jwt_required()
    def post(self):
        check = admin_only()
        if check: return check
        name = request.get_json().get("name")
        return SkillService.create_skill(name)

# ADMIN JOBS
class AdminJobsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminJobService.get_all_jobs()

# ADMIN MESSAGES
class AdminMessageResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check

        client_id = request.args.get("client_id")
        worker_id = request.args.get("worker_id")

        if client_id:
            messages = Message.query.filter_by(client_id=client_id).order_by(Message.timestamp.desc()).all()
            return {"messages": [m.to_dict() for m in messages]}, 200

        if worker_id:
            messages = Message.query.filter_by(worker_id=worker_id).order_by(Message.timestamp.desc()).all()
            return {"messages": [m.to_dict() for m in messages]}, 200

        return AdminMessageService.get_all_messages()

class AdminDeleteMessageResource(Resource):
    @jwt_required()
    def delete(self, message_id):
        check = admin_only()
        if check: return check
        return AdminMessageService.delete_message(message_id)

# ADMIN RATINGS
class AdminRatingsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminRatingService.get_all_ratings()

class AdminRatingsDeleteResource(Resource):
    @jwt_required()
    def delete(self, rating_id):
        check = admin_only()
        if check: return check
        return AdminRatingService.delete_rating(rating_id)

class AdminDeleteRatingResource(Resource):
    @jwt_required()
    def delete(self, rating_id):
        check = admin_only()
        if check: return check
        return AdminRatingService.delete_rating(rating_id)
