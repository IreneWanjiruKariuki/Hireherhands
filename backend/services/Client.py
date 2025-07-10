from models.Client import Client
from extensions import db

class ClientService:
    @staticmethod
    def get_profile(client_id):
        client = Client.query.get(client_id)
        if not client:
            return {"error": "Client not found"}, 404
        return {
            "client_id": client.client_id,
            "fullname": client.fullname,
            "email": client.email,
            "phone": client.phone,
            "gender": client.gender,
            "worker_id": client.workers.worker_id if client.workers else None
        }, 200

    @staticmethod
    def update_profile(client_id, data):
        client = Client.query.get(client_id)
        if not client:
            return {"error": "Client not found"}, 404

        client.fullname = data["fullname"]
        client.email = data["email"]
        client.phone = data["phone"]

        db.session.commit()
        return {"message": "Profile updated"}, 200

    @staticmethod
    def deactivate_account(client_id,by="self"):
        client = Client.query.get(client_id)
        if not client:
            return {"error": "Client not found"}, 404

        client.is_deleted = True
        client.deactivated_by = by or "admin"
        db.session.commit()
        return {"message": "Account deactivated"}, 200

