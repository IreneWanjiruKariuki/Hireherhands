from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from marshmallow import ValidationError
from models.schemas.Client import ClientUpdateSchema
from services.Client import ClientService

client_update_schema = ClientUpdateSchema()

class ClientProfileResource(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt()
        return ClientService.get_profile(claims.get("client_id"))

    @jwt_required()
    def put(self):
        claims = get_jwt()
        client_id = claims.get("client_id")
        try:
            data = client_update_schema.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400
        return ClientService.update_profile(client_id, data)

    @jwt_required()
    def delete(self):
        claims = get_jwt()
        return ClientService.deactivate_account(claims.get("client_id"))
