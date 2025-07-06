from datetime import datetime, timedelta
from models.Client import Client
from models.Worker import Worker
from models.Job import Job, JobStatus
from extensions import db

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
            }
        }, 200
