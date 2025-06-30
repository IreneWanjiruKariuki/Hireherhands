from models.Job import Job
from models.Rating import Rating
from extensions import db

class RatingService:
    @staticmethod
    def submit_rating(job_id, rater_id, rater_type, data):
        job = Job.query.get(job_id)
        if not job:
            return {"error": "Job not found"}, 404

        # Confirm the rater is tied to the job
        if rater_type == "worker" and job.worker_id != rater_id:
            return {"error": "You are not assigned to this job"}, 403
        if rater_type == "client" and job.client_id != rater_id:
            return {"error": "You are not authorized to rate this job"}, 403

        # Validate receiver
        expected_receiver_id = job.client_id if rater_type == "worker" else job.worker_id
        expected_receiver_type = "client" if rater_type == "worker" else "worker"

        if data["receiver_id"] != expected_receiver_id or data["receiver_type"] != expected_receiver_type:
            return {"error": "Invalid receiver"}, 400
        existing = Rating.query.filter_by(
            job_id=job_id,
            rater_id=rater_id,
            rater_type=rater_type
        ).first() 
        if existing:
            return {"error": "You've already rated this job"}, 400


        # Save rating
        rating = Rating(
            job_id=job_id,
            rater_id=rater_id,
            rater_type=rater_type,
            receiver_id=data["receiver_id"],
            receiver_type=data["receiver_type"],
            stars=data["stars"],
            feedback=data.get("feedback")
        )
        db.session.add(rating)
        db.session.commit()

        return {"message": "Rating submitted"}, 201
