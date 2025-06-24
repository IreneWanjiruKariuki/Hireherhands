from models.Client import Client
from models.Worker import Worker
from models.Admin import Admin
from extensions import db, bcrypt
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import SQLAlchemyError
import os

ALLOWED_ADMIN_EMAILS = os.getenv("ALLOWED_ADMIN_EMAILS").split(",")

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

        admin = Admin.query.filter_by(email=email).first()
        if admin and admin.email in ALLOWED_ADMIN_EMAILS and bcrypt.check_password_hash(admin.hashed_password, password):
            identity = str(admin.admin_id)  # make sure it's a string
            claims = {
                "admin_id": admin.admin_id,  # int is fine
                "role": "admin"
            }
            print("identity:", identity, "type:", type(identity))
            print("claims:", claims)
            token = create_access_token(identity=identity, additional_claims=claims)
            return {
                "message": "Admin login successful!",
                "access_token": token,
                "role": "admin",
                "user": admin.to_dict()
            }, 200

            # Try Client login
        client = Client.query.filter_by(email=email).first()
        if client and bcrypt.check_password_hash(client.hashed_password, password):
            # Create claims starting with client
            claims = {
                "client_id": client.client_id,
                "role": "client"
            }
            # Check if client is also a worker
            worker = Worker.query.filter_by(client_id=client.client_id).first()
            if worker:
                claims["role"] = "worker"
                claims["worker_id"] = worker.worker_id
                claims["roles"] = ["client", "worker"]
            token = create_access_token(identity=str(client.client_id), additional_claims=claims)
            return {
                "message": "Client login successful!",
                "access_token": token,
                "role": claims["role"],  # Will be 'client' or 'worker'
                "user": client.to_dict()
            }, 200

        # If neither admin nor client login succeeded
        return {"error": "Invalid credentials"}, 401
