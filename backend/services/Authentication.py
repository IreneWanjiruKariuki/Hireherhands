from models.Client import Client
from models.Worker import Worker
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

        user = Client.query.filter_by(email=email).first()

        if not user or not bcrypt.check_password_hash(user.hashed_password, password):
            return {'error': 'Invalid credentials'}, 401

        claims = {
            "client_id": user.client_id,
            "role": "client"
        }

        worker = Worker.query.filter_by(client_id=user.client_id).first()
        if worker:
            claims["role"] = "worker"
            claims["worker_id"] = worker.worker_id

        token = create_access_token(identity=str(user.client_id), additional_claims=claims)

        return {
            "message": "Login successful!",
            "access_token": token,
            "role": claims["role"]
        }, 200
