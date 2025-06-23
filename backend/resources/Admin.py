from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from services.AdminClientService import AdminClientService
from services.AdminWorkerService import AdminWorkerService
from services.AdminJobService import AdminJobService
from services.AdminSkillService import AdminSkillService
from services.AdminMessageService import AdminMessageService
from services.AdminRatingService import AdminRatingService
from services.AdminCertificationService import AdminCertificationService


from marshmallow import ValidationError
from models.schemas.Auth import SignupSchema, LoginSchema

signup_schema = SignupSchema()
login_schema = LoginSchema()

def admin_only():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return {"error": "Admin access only"}, 403
    return None

class AdminClientsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminClientService.get_all_clients()

class AdminWorkersResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminWorkerService.get_all_workers()

class AdminSkillsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminSkillService.get_all_skills()

class AdminAddSkillResource(Resource):
    @jwt_required()
    def post(self):
        check = admin_only()
        if check: return check
        name = request.get_json().get("name")
        return AdminSkillService.create_skill(name)

class AdminDeleteSkillResource(Resource):
    @jwt_required()
    def delete(self, skill_id):
        check = admin_only()
        if check: return check
        return AdminSkillService.delete_skill(skill_id)

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

class AdminJobsResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminJobService.get_all_jobs()

class AdminMessagesResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminMessageService.get_all_messages()

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


class AdminVerifyWorkerResource(Resource):
    @jwt_required()
    def post(self, worker_id):
        check = admin_only()
        if check: return check
        return AdminWorkerService.verify_worker(worker_id)

class AdminCertificationResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check
        return AdminCertificationService.get_all_certifications()

class ApproveCertificationResource(Resource):
    @jwt_required()
    def post(self, cert_id):
        check = admin_only()
        if check: return check
        return AdminCertificationService.approve_certification(cert_id)

class RejectCertificationResource(Resource):
    @jwt_required()
    def post(self, cert_id):
        check = admin_only()
        if check: return check
        return AdminCertificationService.reject_certification(cert_id)

class AdminDeleteRatingResource(Resource):
    @jwt_required()
    def delete(self, rating_id):
        check = admin_only()
        if check: return check
        return AdminRatingService.delete_rating(rating_id)

class AdminMessageResource(Resource):
    @jwt_required()
    def get(self):
        check = admin_only()
        if check: return check

        # Optional query parameters
        client_id = request.args.get("client_id")
        worker_id = request.args.get("worker_id")

        if client_id:
            messages = Message.query.filter_by(client_id=client_id).order_by(Message.timestamp.desc()).all()
            return {"messages": [m.to_dict() for m in messages]}, 200

        if worker_id:
            messages = Message.query.filter_by(worker_id=worker_id).order_by(Message.timestamp.desc()).all()
            return {"messages": [m.to_dict() for m in messages]}, 200

        # Default: return all messages
        return AdminMessageService.get_all_messages()


class AdminDeleteMessageResource(Resource):
    @jwt_required()
    def delete(self, message_id):
        check = admin_only()
        if check: return check
        return AdminMessageService.delete_message(message_id)
