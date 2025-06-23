from models.Rating import Rating
from extensions import db

class AdminRatingService:
    @staticmethod
    def get_all_ratings():
        ratings = Rating.query.order_by(Rating.created_at.desc()).all()
        return {"ratings": [r.to_dict() for r in ratings]}, 200

    @staticmethod
    def delete_rating(rating_id):
        rating = Rating.query.get(rating_id)
        if not rating:
            return {"error": "Rating not found"}, 404
        db.session.delete(rating)
        db.session.commit()
        return {"message": "Rating deleted"}, 200
