#polymorphic design since worker can rate client and vice versa
#admin can oversee all ratings and flag inappropriate ratings but is not an active participant in the rating process

from extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class Rating(db.Model, SerializerMixin):
    __tablename__ = 'ratings'
    
    rating_id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), nullable=False)

    rater_id = db.Column(db.Integer, nullable=False)      # the person giving the rating
    rater_type = db.Column(db.String(50), nullable=False) # 'client' or 'worker'

    receiver_id = db.Column(db.Integer, nullable=False)      # the person receiving the rating
    receiver_type = db.Column(db.String(50), nullable=False) # 'client' or 'worker'

    #optional fields
    stars = db.Column(db.Integer, nullable=True)  # from 0 to 5
    feedback = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Rating {self.stars} for Job {self.job_id} by {self.rater_type} {self.rater_id}>'
