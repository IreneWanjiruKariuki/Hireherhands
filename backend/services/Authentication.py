from models.Client import Client
from models.Worker import Worker
from extensions import db, bcrypt
from flask_jwt_extended import create_access_token

class AuthenticationService:
#client registration
    @staticmethod
    def register(data):
        fullname = data.get('fullname')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')

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
            phone=phone,
            hashed_password=hashed_password
        )
        db.session.add(client)
        db.session.commit()
        return {'message': 'Registered successfully'}, 201

#login for client and worker
    @staticmethod
    def login(data):
        email =data.get('email')
        password = data.get('password')
    
        #validation on inputs
        #missing fields
        if not all([email, password]):
            return {'error': 'Missing required fields'}, 400

        user = Client.query.filter_by(email=email).first()

        #check if user exists
        if not user:
            return {'error': 'Account not found'}, 404

        #check if password is correct
        if not bcrypt.check_password_hash(user.hashed_password, password):
            return {'error': 'Invalid password'}, 401

        #check if this user applied to be a worker
        worker = Worker.query.filter_by(client_id=user.client_id).first()

        worker_status = None
        if worker:
            worker_status = 'approved' if worker.is_approved else 'pending'

        #create access token
        access_token = create_access_token(identity={
            'client_id': user.client_id,
            'email': user.email,
            'worker_status': worker_status
        })

        return {
            'message': 'Login successful!',
            'access_token': access_token,
            'worker_status': worker_status
        }, 200

