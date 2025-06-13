from models.Worker import Worker
from extensions import db

class AdminService:
    @staticmethod
    def approve_worker(worker_id):
        worker = Worker.query.get(worker_id)

        #check if the worker exists
        if not worker:
            return {'error': 'Worker not found'}, 404
        
        worker.is_approved = True
        db.session.commit()
        return {'message': 'Worker approved successfully'}, 200

    @staticmethod
    def reject_worker(worker_id):
        worker = Worker.query.get(worker_id)

        #check if the worker exists
        if not worker:
            return {'error': 'Worker not found'}, 404
        
        db.session.delete(worker)
        db.session.commit()
        return {'message': 'Worker rejected and removed successfully'}, 200

    @staticmethod
    def list_pending_workers():
        pending_workers = Worker.query.filter_by(is_approved=False).all()
        serialized = [worker.serialize() for worker in pending_workers]
        return serialized, 200