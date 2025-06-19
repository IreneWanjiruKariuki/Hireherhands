from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from marshmallow import ValidationError
from models.schemas.RatingSchema import RatingSchema
from services.Rating import RatingService

rating_schema = RatingSchema()

class JobRatingResource(Resource):
    @jwt_required()
    def post(self, job_id):
        claims = get_jwt()
        rater_id = claims.get("client_id") or claims.get("worker_id")
        rater_type = claims.get("role")
        try:
            data = rating_schema.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400

        return RatingService.submit_rating(job_id, rater_id, rater_type, data)
