from models.Worker import Worker
from extensions import db

class AdminWorkerService:
    @staticmethod
    def get_all_workers():
        workers = Worker.query.all()
        return {"workers": [w.to_dict() for w in workers]}, 200

    @staticmethod
    def get_all_worker_applications():
        workers = Worker.query.filter_by(is_approved=False).all()
        return {"applications": [w.to_dict() for w in workers]}, 200

    @staticmethod
    def approve_or_reject_worker(worker_id, action):
        worker = Worker.query.get(worker_id)
        if not worker:
            return {"error": "Worker not found"}, 404
        if action == "approve":
            worker.is_approved = True
        elif action == "reject":
            db.session.delete(worker)
        else:
            return {"error": "Invalid action"}, 400
        db.session.commit()
        return {"message": f"Worker {action}ed successfully"}, 200

    @staticmethod
    def verify_worker(worker_id):
        worker = Worker.query.get(worker_id)
        if not worker:
            return {"error": "Worker not found"}, 404
        worker.is_verified = True
        db.session.commit()
        return {"message": "Worker verified"}, 200
