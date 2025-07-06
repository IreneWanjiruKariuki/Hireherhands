from models.Client import Client
from models.Job import Job
from extensions import db

class AdminClientService:
    @staticmethod
    def get_all_clients():
        clients = Client.query.all()
        client_list = []

        for c in clients:
            client_dict = {
                "client_id": c.client_id,
                "fullname": c.fullname,
                "email": c.email,
                "phone": c.phone,
                "created_at": c.created_at.isoformat() if c.created_at else None,
                "is_deleted": c.is_deleted,
                "jobs": [
                    {
                        "job_id": j.job_id,
                        "description": j.description,
                        "status": j.status.value,
                        "budget": j.budget,
                        "created_at": j.created_at.isoformat() if j.created_at else None,
                        "skill_name": j.skill_name
                    } for j in c.jobs
                ]
            }

            client_list.append(client_dict)

        return {"clients": client_list}, 200

     
    @staticmethod
    def toggle_client_status(client_id):
        client = Client.query.get(client_id)
        if not client:
            return {"error": "Client not found"}, 404
        client.is_deleted = not client.is_deleted
        status = "deactivated" if client.is_deleted else "reactivated"
        db.session.commit()
        return {"message": f"Client {status} successfully."}, 200







