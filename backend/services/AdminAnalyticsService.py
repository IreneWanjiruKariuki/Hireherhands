from datetime import datetime, timedelta
from models.Client import Client
from models.Worker import Worker
from models.Job import Job, JobStatus
from models.Skill import Skill
from extensions import db
from sqlalchemy import func

class AdminAnalyticsService:
    @staticmethod
    def get_system_summary():
        now = datetime.utcnow()
        start_of_week = now - timedelta(days=now.weekday())
        start_of_month = datetime(now.year, now.month, 1)

        # Clients
        total_clients = db.session.query(Client).count()
        clients_this_week = db.session.query(Client).filter(Client.created_at >= start_of_week).count()
        clients_this_month = db.session.query(Client).filter(Client.created_at >= start_of_month).count()

        # Gender breakdown (clients only)
        female_clients = db.session.query(Client).filter(func.lower(Client.gender) == "female").count()
        male_clients = db.session.query(Client).filter(func.lower(Client.gender) == "male").count()

        # Workers
        total_workers = db.session.query(Worker).count()
        approved_workers = db.session.query(Worker).filter_by(is_approved=True).count()
        pending_workers = db.session.query(Worker).filter_by(is_approved=False).count()

        # Jobs
        total_jobs = db.session.query(Job).count()
        job_status_counts = {
            status.value: db.session.query(Job).filter_by(status=status).count()
            for status in JobStatus
        }

        # Top skills by worker count (limit 5)
        skill_counts = (
            db.session.query(Skill.skill_name, func.count().label("count"))
            .join(Skill.workers)
            .group_by(Skill.skill_name)
            .order_by(func.count().desc())
            .limit(5)
            .all()
        )
        top_skills = [{"name": name, "count": count} for name, count in skill_counts]

        # Job trends: jobs created by month (last 6 months)
        six_months_ago = datetime(now.year, now.month, 1) - timedelta(days=180)
        jobs_by_month = (
            db.session.query(
                func.date_trunc('month', Job.created_at).label('month'),
                func.count().label('count')
            )
            .filter(Job.created_at >= six_months_ago)
            .group_by(func.date_trunc('month', Job.created_at))
            .order_by(func.date_trunc('month', Job.created_at))
            .all()
        )
        job_months = [m[0].strftime("%b %Y") for m in jobs_by_month]
        job_counts = [c for _, c in jobs_by_month]

        return {
            "clients": {
                "total": total_clients,
                "this_week": clients_this_week,
                "this_month": clients_this_month
            },
            "workers": {
                "total": total_workers,
                "approved": approved_workers,
                "pending": pending_workers
            },
            "jobs": {
                "total": total_jobs,
                **job_status_counts
            },
            "gender": {
                "female_clients": female_clients,
                "male_clients": male_clients,
                "female_workers": total_workers,  # All workers are female
                "male_workers": 0
            },
            "skills": {
                "top": top_skills
            },
            "trends": {
                "months": job_months,
                "counts": job_counts
            }
        }, 200
