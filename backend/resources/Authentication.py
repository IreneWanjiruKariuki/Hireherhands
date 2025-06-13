from flask_restful import Resource
from flask import request
from services.Authentication import AuthenticationService

#Client registration and login
class SignupResource(Resource):

    def post(self):
        data = request.get_json()
        fullname = data.get('fullname')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')

        if not all([fullname, email, password, phone]):
            return {'error': 'Missing required fields'}, 400

        return AuthenticationService.register(data)

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return {'error': 'Missing required fields'}, 400

        return AuthenticationService.login(data)


