from flask import request
import traceback
from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from marshmallow import ValidationError
from models.schemas.Worker import WorkerRegisterSchema, WorkerUpdateSchema, WorkerSkillSchema
from services.Worker import WorkerService

worker_register_schema = WorkerRegisterSchema()
worker_update_schema = WorkerUpdateSchema()
worker_skill_schema = WorkerSkillSchema()

class WorkerRegisterResource(Resource):
    @jwt_required()
    def post(self):
        claims = get_jwt()
        form_data = request.form.to_dict()
        form_data["skills"] = request.form.getlist("skills")
        try:
            form_data["skills"] = [int(s) for s in form_data["skills"]]
        except ValueError:
            return {"error": "Invalid skill IDs."}, 400

        if "experience_years" in form_data:
            try:
                form_data["experience_years"] = int(form_data["experience_years"])
            except ValueError:
                return {"error": "Invalid experience value."}, 400

        try:
            data = worker_register_schema.load(form_data)
        except ValidationError as err:
            print("Validation Error:", err.messages)
            return {"errors": err.messages}, 400
        return WorkerService.register_worker(claims.get("client_id"), data, request.files.get("certificate"))

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
        data = request.get_json()
        skill_ids = data.get("skills", [])

        if not skill_ids or not isinstance(skill_ids, list):
            return {"error": "Skill list is required"}, 400

        client_id = get_jwt_identity()
        worker = Worker.query.filter_by(client_id=client_id).first()
        if not worker:
            return {"error": "Worker not found"}, 404

        # Clear existing skills first (optional)
        worker.skills = []

        # Attach new skills
        for sid in skill_ids:
            skill = Skill.query.get(sid)
            if skill:
                worker.skills.append(skill)

        db.session.commit()
        return {"message": "Skills attached successfully"}, 200