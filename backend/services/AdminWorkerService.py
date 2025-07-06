from models.Worker import Worker
from sqlalchemy.orm import joinedload
from extensions import db

class AdminWorkerService:
    @staticmethod
    def get_all_workers():
        #workers = Worker.query.all()
        workers = Worker.query.options(joinedload(Worker.skills), joinedload(Worker.client)).all()
        return {
            "workers": [
                {
                    "worker_id": w.worker_id,
                    "client": {
                        "fullname": w.client.fullname,
                        "email": w.client.email,
                        "phone": w.client.phone
                        },
                        "location": w.location,
                        "bio": w.bio,
                        "hourly_rate": w.hourly_rate,
                        "created_at":  w.created_at.isoformat(),
                        "is_approved": w.is_approved,
                        "is_deleted": w.is_deleted,
                        "skills": [s.skill_name for s in w.skills]
                } for w in workers
            ]
        }, 200


    @staticmethod
    def get_all_worker_applications():
        workers = Worker.query.filter_by(is_approved=False).all()
        return {
            "workers": [{
                "worker_id": w.worker_id,
                "client": {
                    "fullname": w.client.fullname,
                    "email": w.client.email,
                    "phone": w.client.phone,
                    },
                "location": w.location,
                "is_approved": w.is_approved,
                "created_at": w.created_at.isoformat(),
                "skills": [s.skill_name for s in w.skills]
                } for w in workers
            ]
        }, 200


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
    
    @staticmethod
    def toggle_worker_status(worker_id):
        worker = Worker.query.get(worker_id)
        if not worker:
            return {"error": "Worker not found"}, 404
        worker.is_deleted = not worker.is_deleted
        status = "deactivated" if worker.is_deleted else "reactivated"
        db.session.commit()
        return {"message": f"Worker {status} successfully."}, 200

