from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt
from services.WorkerPortfolio import WorkerPortfolioService

class WorkerPortfolioResource(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt()
        worker_id = claims.get("worker_id")
        return WorkerPortfolioService.get_portfolio(worker_id)
