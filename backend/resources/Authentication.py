from flask_restful import Resource
from flask import request
from services.Authentication import AuthenticationService

#Client registration and login
class SignupResource(Resource):

    def post(self):
        data = request.get_json()
        return AuthenticationService.register(data)

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        return AuthenticationService.login(data)


