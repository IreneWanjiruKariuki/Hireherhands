from models.Client import Client
from models.Worker import Worker
from models.Skill import Skill
from models.Job import Job
from models.Admin import Admin
from models.Message import Message
from models.Rating import Rating
from extensions import db, bcrypt
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import SQLAlchemyError

class AdminService:
    @staticmethod
    def get_all_clients():
        clients = Client.query.all()
        return {"clients": [c.to_dict() for c in clients]}, 200

    @staticmethod
    def get_all_workers():
        workers = Worker.query.all()
        return {"workers": [w.to_dict() for w in workers]}, 200

    @staticmethod
    def get_all_skills():
        skills = Skill.query.all()
        return {"skills": [s.to_dict() for s in skills]}, 200

    @staticmethod
    def create_skill(name):
        if Skill.query.filter_by(name=name).first():
            return {"error": "Skill already exists"}, 400
        skill = Skill(name=name)
        db.session.add(skill)
        db.session.commit()
        return {"message": "Skill added", "skill": skill.to_dict()}, 201

    @staticmethod
    def delete_skill(skill_id):
        skill = Skill.query.get(skill_id)
        if not skill:
            return {"error": "Skill not found"}, 404
        db.session.delete(skill)
        db.session.commit()
        return {"message": "Skill deleted"}, 200

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
    def get_all_jobs():
        jobs = Job.query.order_by(Job.created_at.desc()).all()
        return {"jobs": [j.to_dict() for j in jobs]}, 200

    @staticmethod
    def get_all_messages():
        messages = Message.query.order_by(Message.timestamp.desc()).all()
        return {"messages": [m.to_dict() for m in messages]}, 200

    @staticmethod
    def get_all_ratings():
        ratings = Rating.query.order_by(Rating.created_at.desc()).all()
        return {"ratings": [r.to_dict() for r in ratings]}, 200
    @staticmethod
    def verify_worker(worker_id):
        worker = Worker.query.get(worker_id)
        if not worker:
            return {"error": "Worker not found"}, 404
        worker.is_verified = True
        db.session.commit()
        return {"message": "Worker verified"}, 200

    @staticmethod
    def delete_rating(rating_id):
        rating = Rating.query.get(rating_id)
        if not rating:
            return {"error": "Rating not found"}, 404
        db.session.delete(rating)
        db.session.commit()
        return {"message": "Rating deleted"}, 200

    @staticmethod
    def delete_message(message_id):
        message = Message.query.get(message_id)
        if not message:
            return {"error": "Message not found"}, 404
        db.session.delete(message)
        db.session.commit()
        return {"message": "Message deleted"}, 200

