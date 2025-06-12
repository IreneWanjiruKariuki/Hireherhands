from models.Client import Client
from models.Worker import Worker
from models.Admin import Admin
from extensions import db
from flask_jwt_extended import create_access_token

class AuthenticationService:
#client registration
    @staticmethod
    def register_client(data):
        fullname = data.get('fullname')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')

        #validation on inputs
        #missing fields
        if not all([fullname, email, password, phone]):
            return {'error': 'Missing required fields'}, 400

        #email already exists
        if Client.query.filter_by(email=email).first():
            return {'error': 'Client with this email already exists'}, 400
        
        #hash the password for secure storage
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        client = Client(
            fullname=fullname,
            email=email,
            hashed_password=hashed_password,
            phone=phone
        )
        db.session.add(client)
        db.session.commit()
        return {'message': 'Client registered successfully'}, 201

#worker registration
    @staticmethod
    def register_worker(data):
        fullname = data.get('fullname')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')

        #validation on inputs
        #missing fields
        if not all([fullname, email, password, phone]):
            return {'error': 'Missing required fields'}, 400

        #email already exists
        if Worker.query.filter_by(email=email).first():
            return {'error': 'Worker with this email already exists'}, 400
        
        #hash the password for secure storage
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        worker = Worker(
            fullname=fullname,
            email=email,
            hashed_password=hashed_password,
            phone=phone
        )
        db.session.add(worker)
        db.session.commit()
        return {'message': 'Worker registered successfully'}, 201
        