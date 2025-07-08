from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from services.Job import JobService

# POST /jobs - create job (client only)
class CreateJobResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        claims = get_jwt()
        client_id = claims.get("client_id")
        if not client_id:
            return {"error": "Client ID missing from token. Job posting not allowed."}, 403
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
        claims = get_jwt()
        client_id = claims.get("client_id")
        if not client_id:
            return {"error": "Client ID missing from token. Job posting not allowed."}, 403
        worker_id = data.get('worker_id')
        return JobService.request_worker(job_id, worker_id)


# POST /jobs/<job_id>/accept - worker accepts job
class AcceptJobResource(Resource):
    @jwt_required()
    def post(self, job_id):
        claims = get_jwt()
        if claims.get("role") != "worker":
            return {"error": "Only workers can accept jobs"}, 403

        worker_id = claims.get("worker_id")  # worker linked to client account
        return JobService.accept_job(job_id, worker_id)


# POST /jobs/<job_id>/reject - worker rejects job
class RejectJobResource(Resource):
    @jwt_required()
    def post(self, job_id):
        claims = get_jwt()
        if claims.get("role") != "worker":
            return {"error": "Only workers can reject jobs"}, 403

        worker_id = claims.get("worker_id")  # worker linked to client account
        return JobService.reject_job(job_id, worker_id)


# POST /jobs/<job_id>/worker-complete - worker marks job done
class WorkerMarkDoneResource(Resource):
    @jwt_required()
    def post(self, job_id):
        claims = get_jwt()
        if claims.get("role") != "worker":
            return {"error": "Only workers can mark jobs as done"}, 403

        worker_id = claims.get("worker_id")  # worker linked to client account
        return JobService.worker_mark_done(job_id, worker_id)


# POST /jobs/<job_id>/client-complete - client confirms completion
class ClientConfirmCompletionResource(Resource):
    @jwt_required()
    def post(self, job_id):
        claims = get_jwt()
        if not claims.get("client_id"):
            return {"error": "Client ID missing. Unauthorized."}, 403


        client_id = claims.get("client_id")
        return JobService.client_confirm_completion(job_id, client_id)

class ClientJobHistoryResource(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt()
        client_id = claims.get("client_id")
        return JobService.get_client_job_history(client_id)

class WorkerJobHistoryResource(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt()
        worker_id = claims.get("worker_id")
        return JobService.get_worker_job_history(worker_id)

class JobDetailResource(Resource):
    @jwt_required()
    def get(self, job_id):
        job = Job.query.get(job_id)
        if not job:
            return {"error": "Job not found"}, 404
        return job_output_schema.dump(job), 200

# GET /jobs/worker-requests - jobs in "requested" state for this worker
class WorkerRequestedJobsResource(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt()
        worker_id = claims.get("worker_id")
        return JobService.get_worker_requested_jobs(worker_id)


