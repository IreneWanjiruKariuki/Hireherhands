from models.WorkerPortfolio import WorkerPortfolio

class WorkerPortfolioService:
    @staticmethod
    def get_portfolio(worker_id):
        portfolio = WorkerPortfolio.query.filter_by(worker_id=worker_id).all()
        return {
            "portfolio": [p.to_dict() for p in portfolio]
        }, 200

