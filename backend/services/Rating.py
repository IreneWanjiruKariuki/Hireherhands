from models.Rating import Rating
from extensions import db

class RatingService:
    @staticmethod
    def submit_rating(job_id, rater_id, rater_type, data):
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

