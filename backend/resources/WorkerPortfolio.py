from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt
from services.WorkerPortfolio import WorkerPortfolioService

class WorkerPortfolioResource(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt()
        worker_id = claims.get("worker_id")
        return WorkerPortfolioService.get_portfolio(worker_id)
        
    @jwt_required()
    def post(self):
        claims = get_jwt()
        data = request.get_json()
        return WorkerPortfolioService.add_to_portfolio(claims.get("worker_id"), data)

    @jwt_required()
    def delete(self, portfolio_id):
        claims = get_jwt()
        return WorkerPortfolioService.remove_from_portfolio(claims.get("worker_id"), portfolio_id)
