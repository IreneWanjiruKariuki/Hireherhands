from models.Client import Client
from models.Worker import Worker
from models.Admin import Admin
from extensions import db, bcrypt
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import SQLAlchemyError

class AuthenticationService:

    @staticmethod
    def register(data):
        try:
            if Client.query.filter_by(email=data["email"]).first():
                return {'error': 'Email already registered'}, 400

            hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8')

            client = Client(
                fullname=data["fullname"],
                email=data["email"],
                phone=data["phone"],
                hashed_password=hashed_password
            )
            db.session.add(client)
            db.session.commit()

            return {'message': 'Registered successfully'}, 201

        except SQLAlchemyError:
            db.session.rollback()
            return {'error': 'Database error'}, 500
    @staticmethod
    def login(data):
        email = data["email"]
        password = data["password"]

        # Try Admin login 
        admin = Admin.query.filter_by(email=email).first()
        if admin and bcrypt.check_password_hash(admin.hashed_password, password):
            claims = {"admin_id": admin.admin_id, "role": "admin"}
            token = create_access_token(identity=admin.admin_id, additional_claims=claims)
            return {
            "message": "Admin login successful!",
            "access_token": token,
            "role": "admin",
            "user": admin.to_dict()
        }, 200

        # Try Client login
        client = Client.query.filter_by(email=email).first()
        if client and bcrypt.check_password_hash(client.hashed_password, password):
            claims = {"client_id": client.client_id, "role": "client"}
            
            # Check if the client is also a worker
            worker = Worker.query.filter_by(client_id=client.client_id).first()
            if worker:
                claims["role"] = "worker"
                claims["worker_id"] = worker.worker_id
            token = create_access_token(identity=client.client_id, additional_claims=claims)
            return {
                "message": "Client login successful!",
                "access_token": token,
                "role": claims["role"],
                "user": client.to_dict()
            }, 200
            # If neither admin nor client login succeeded
        return {"error": "Invalid credentials"}, 401
