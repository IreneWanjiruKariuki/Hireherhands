from models.WorkerPortfolio import WorkerPortfolio

class WorkerPortfolioService:
    @staticmethod
    def get_portfolio(worker_id):
        portfolio = WorkerPortfolio.query.filter_by(worker_id=worker_id).all()
        return {
            "portfolio": [p.to_dict() for p in portfolio]
        }, 200
    @staticmethod
    def add_to_portfolio(worker_id, data):
        item = WorkerPortfolio(
            worker_id=worker_id,
            description=data.get("description"),
            image_url=data.get("image_url")
        )
        db.session.add(item)
        db.session.commit()
        return {"message": "Portfolio item added"}, 201
    
    @staticmethod
    def remove_from_portfolio(worker_id, portfolio_id):
        item = WorkerPortfolio.query.filter_by(worker_id=worker_id, portfolio_id=portfolio_id).first()
        if not item:
            return {"error": "Portfolio item not found"}, 404
        db.session.delete(item)
        db.session.commit()
        return {"message": "Portfolio item removed"}, 200


