from extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class WorkerPortfolio(db.Model, SerializerMixin):
    __tablename__ = 'worker_portfolio'

    portfolio_id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.worker_id'), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)  # URL to the portfolio image
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    def __repr__(self):
        return f'<PortfolioItem {self.portfolio_id} by Worker {self.worker_id}>'