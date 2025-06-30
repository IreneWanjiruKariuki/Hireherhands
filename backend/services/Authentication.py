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
        try:
            email = data["email"]
            password = data["password"]
            # Attempt admin login
            admin = Admin.query.filter_by(email=email).first()
            if admin and admin.email in ALLOWED_ADMIN_EMAILS and bcrypt.check_password_hash(admin.hashed_password, password):
                identity = str(admin.admin_id)
                claims = {
                    "admin_id": admin.admin_id,
                    "role": "admin"
                }
                token = create_access_token(identity=identity, additional_claims=claims)

                admin_data = admin.to_dict(only=("admin_id", "email", "created_at"))
                return {
                    "message": "Admin login successful!",
                    "access_token": token,
                    "role": "admin",
                    "user": admin_data
                }, 200

            # Attempt client login
            client = Client.query.filter_by(email=email).first()
            if client and bcrypt.check_password_hash(client.hashed_password, password):
                claims = {
                    "client_id": client.client_id,
                    "role": "client"
                }

                """ Build basic client data
                client_data = client.to_dict(only=("client_id", "fullname", "email", "phone", "created_at"))"""

                # Check if client is also a worker
                worker = Worker.query.filter_by(client_id=client.client_id).first()
                if worker:
                    claims["role"] = "worker"
                    claims["worker_id"] = worker.worker_id
                    claims["roles"] = ["client", "worker"]

                token = create_access_token(identity=str(client.client_id), additional_claims=claims)
                client_data = client.to_dict(only=("client_id", "fullname", "email", "phone", "created_at"))
                if worker:
                    worker_data = worker.to_dict(only=("worker_id", "bio", "hourly_rate", "location", "status", "is_verified", "is_approved"))
                    client_data["worker"] = worker_data
                user = {
                    "client_id": client.client_id,
                    "fullname": client.fullname,
                    "email": client.email,
                    "phone": client.phone
                }
                if worker:
                    user["worker_id"] = worker.worker_id
                response_data = {
                    "message": "Client login successful!",
                    "access_token": token,
                    "role": claims["role"],  # "client" or "worker"
                    "user": user
                }

                return response_data, 200

            return {"error": "Invalid credentials"}, 401

        except Exception as e:
            print("Login exception:", str(e))
            return {"error": "Internal server error"}, 500
