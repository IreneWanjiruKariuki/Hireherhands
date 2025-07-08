from flask_restful import Resource
from flask import request
from marshmallow import ValidationError
from models.schemas.Auth import SignupSchema, LoginSchema
from services.Authentication import AuthenticationService
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Client import Client
from extensions import db, bcrypt

# Instantiate schema objects
signup_schema = SignupSchema()
login_schema = LoginSchema()

#Client registration and login
class SignupResource(Resource):

    def post(self):
        try:
            data = signup_schema.load(request.get_json())
        except ValidationError as err:
            print("Validation errors:", err.messages) 
            return {'errors': err.messages}, 400
        return AuthenticationService.register(data)

class LoginResource(Resource):
    def post(self):
        try:
            data = login_schema.load(request.get_json())
        except ValidationError as err:
            return {'errors': err.messages}, 400
        return AuthenticationService.login(data)

class CurrentUserResource(Resource):
    @jwt_required()
    def get(self):
        client_id = get_jwt_identity()
        client = Client.query.get(client_id)

        if not client:
            return {"error": "Client not found"}, 404

        return {
            "client_id": client.client_id,
            "fullname": client.fullname,
            "email": client.email,
            "phone": client.phone,
            "gender": client.gender
        }, 200


