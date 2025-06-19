from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from marshmallow import ValidationError
from models.schemas.WorkerSchema import WorkerRegisterSchema, WorkerUpdateSchema, WorkerSkillSchema
from services.Worker import WorkerService

worker_register_schema = WorkerRegisterSchema()
worker_update_schema = WorkerUpdateSchema()
worker_skill_schema = WorkerSkillSchema()

class WorkerRegisterResource(Resource):
    @jwt_required()
    def post(self):
        claims = get_jwt()
        try:
            data = worker_register_schema.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400
        return WorkerService.register_worker(claims.get("client_id"), data)

class WorkerProfileResource(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt()
        return WorkerService.get_profile(claims.get("worker_id"))

    @jwt_required()
    def put(self):
        claims = get_jwt()
        try:
            data = worker_update_schema.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400
        return WorkerService.update_profile(claims.get("worker_id"), data)

    @jwt_required()
    def delete(self):
        claims = get_jwt()
        return WorkerService.deactivate(claims.get("worker_id"))

class WorkerSkillsResource(Resource):
    @jwt_required()
    def post(self):
        claims = get_jwt()
        try:
            data = worker_skill_schema.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400
        return WorkerService.add_skills(claims.get("worker_id"), data["skills"])

    @jwt_required()
    def get(self):
        claims = get_jwt()
        return WorkerService.get_skills(claims.get("worker_id"))

    @jwt_required()
    def delete(self):
        claims = get_jwt()
        skill_id = request.get_json().get("skill_id")
        return WorkerService.remove_skill(claims.get("worker_id"), skill_id)
