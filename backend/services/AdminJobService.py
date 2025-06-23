from models.Job import Job

class AdminJobService:
    @staticmethod
    def get_all_jobs():
        jobs = Job.query.order_by(Job.created_at.desc()).all()
        return {"jobs": [j.to_dict() for j in jobs]}, 200
