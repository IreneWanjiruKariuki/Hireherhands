from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.Job import Job

# POST /jobs - create job (client only)
class CreateJobResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        identity = get_jwt_identity()
        client_id = identity['client_id']
        return JobService.create_job(data, client_id)


# GET /jobs/<job_id>/workers - get matching workers
class MatchingWorkersResource(Resource):
    @jwt_required()
    def get(self, job_id):
        return JobService.matching_workers(job_id)


# POST /jobs/<job_id>/request - client requests a worker
class RequestWorkerResource(Resource):
    @jwt_required()
    def post(self, job_id):
        data = request.get_json()
        worker_id = data.get('worker_id')
        return JobService.request_worker(job_id, worker_id)


# POST /jobs/<job_id>/accept - worker accepts job
class AcceptJobResource(Resource):
    @jwt_required()
    def post(self, job_id):
        identity = get_jwt_identity()
        worker_id = identity['client_id']  # worker linked to client account
        return JobService.accept_job(job_id, worker_id)


# POST /jobs/<job_id>/reject - worker rejects job
class RejectJobResource(Resource):
    @jwt_required()
    def post(self, job_id):
        identity = get_jwt_identity()
        worker_id = identity['client_id']
        return JobService.reject_job(job_id, worker_id)


# POST /jobs/<job_id>/worker-complete - worker marks job done
class WorkerMarkDoneResource(Resource):
    @jwt_required()
    def post(self, job_id):
        identity = get_jwt_identity()
        worker_id = identity['client_id']
        return JobService.worker_mark_done(job_id, worker_id)


# POST /jobs/<job_id>/client-complete - client confirms completion
class ClientConfirmCompletionResource(Resource):
    @jwt_required()
    def post(self, job_id):
        identity = get_jwt_identity()
        client_id = identity['client_id']
        return JobService.client_confirm_completion(job_id, client_id)
