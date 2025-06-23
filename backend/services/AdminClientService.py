from models.Client import Client

class AdminClientService:
    @staticmethod
    def get_all_clients():
        clients = Client.query.all()
        return {"clients": [c.to_dict() for c in clients]}, 200
