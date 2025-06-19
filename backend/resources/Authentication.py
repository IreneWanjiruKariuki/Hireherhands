from flask_restful import Resource
from flask import request
from marshmallow import ValidationError
from models.schemas.Auth import SignupSchema, LoginSchema
from services.Authentication import AuthenticationService

# Instantiate schema objects
signup_schema = SignupSchema()
login_schema = LoginSchema()

#Client registration and login
class SignupResource(Resource):

    def post(self):
        try:
            data = signup_schema.load(request.get_json())
        except ValidationError as err:
            return {'errors': err.messages}, 400
        return AuthenticationService.register(data)

class LoginResource(Resource):
    def post(self):
        try:
            data = login_schema.load(request.get_json())
        except ValidationError as err:
            return {'errors': err.messages}, 400
        return AuthenticationService.login(data)


