from models.Client import Client
from models.Job import Job

class AdminClientService:
    @staticmethod
    def get_all_clients():
        clients = Client.query.all()
        client_list = []
        for c in clients:
            client_dict = c.to_dict(only=("client_id", "fullname", "email", "phone", "created_at"))

            # Optional: add job summary
            client_dict["jobs"] = [
                j.to_dict(only=("job_id", "description", "status", "budget", "created_at", "skill_name"))
                for j in c.jobs
            ]
            client_list.append(client_dict)
        return {"clients": client_list}, 200

