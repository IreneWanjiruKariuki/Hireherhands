from flask_restful import Resource, request
from flask_jwt_extended import jwt_required, get_jwt
from services.Certification import CertificationService

class CertificationSubmissionResource(Resource):
    @jwt_required()
    def post(self):
        claims = get_jwt()
        worker_id = claims.get("worker_id")
        data = request.get_json()
        return CertificationService.submit_certification(worker_id, data)
