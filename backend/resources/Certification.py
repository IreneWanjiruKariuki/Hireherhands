from flask_restful import Resource, request
from flask_jwt_extended import jwt_required, get_jwt
from services.Certification import CertificationService
from marshmallow import ValidationError
from models.schemas.Certification import CertificationCreateSchema

certification_schema = CertificationCreateSchema()

class CertificationSubmissionResource(Resource):
    @jwt_required()
    def post(self):
        claims = get_jwt()
        worker_id = claims.get("worker_id")
        data = request.get_json()
        try:
            validated_data = CertificationCreateSchema().load(data)
        except ValidationError as err:
            return {"error": err.messages}, 400
        return CertificationService.submit_certification(worker_id, validated_data)
