from models.Worker import Worker, WorkerStatus
from sqlalchemy.orm import joinedload
from extensions import db

class AdminWorkerService:
    @staticmethod
    def get_all_workers():
        workers = Worker.query.all()
        #workers = Worker.query.filter_by(status=WorkerStatus.REQUESTS).all()
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
                        "is_deleted": w.is_deleted,
                        "certificate_url": w.certificate_url,
                        "experience_years": w.experience_years,
                        "status": w.status.value,
                        "is_verified": w.is_verified,
                        "skills": [s.skill_name for s in w.skills]
                } for w in workers
            ]
        }, 200


    @staticmethod
    def get_all_worker_applications():
        workers = Worker.query.filter_by(approval_status=ApprovalStatus.REQUESTS).all()
        return {
            "workers": [{
                "worker_id": w.worker_id,
                "client": {
                    "fullname": w.client.fullname,
                    "email": w.client.email,
                    "phone": w.client.phone,
                    },
                "location": w.location,
                "created_at": w.created_at.isoformat(),
                "skills": [s.skill_name for s in w.skills],
                "certificate_url": w.certificate_url,
                "experience_years": w.experience_years,
                "status": w.status.value,            

                } for w in workers
            ]
        }, 200


    @staticmethod
    def approve_or_reject_worker(worker_id, action):
        worker = Worker.query.get(worker_id)

        if action == "approve":
            worker.status = WorkerStatus.APPROVED
        elif action == "reject":
            worker.status = WorkerStatus.REJECTED
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
        if worker.status == WorkerStatus.DEACTIVATED:
            worker.status = WorkerStatus.ACTIVE
        else:
            worker.status = WorkerStatus.DEACTIVATED
        if not worker:
            return {"error": "Worker not found"}, 404
        
        db.session.commit()
        return {"message": f"Worker {status} successfully."}, 200

