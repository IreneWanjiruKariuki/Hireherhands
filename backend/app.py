from dotenv import load_dotenv
load_dotenv() 
from flask import Flask
import os
from config import Config
config = Config()  # instantiate the class
from extensions import db, bcrypt, cors, migrate, jwt
from models import *
from flask_restful import Api
# Import all resources
from resources.Authentication import SignupResource, LoginResource
from resources.Client import ClientProfileResource
from resources.Worker import WorkerRegisterResource, WorkerProfileResource, WorkerSkillsResource
from resources.WorkerPortfolio import WorkerPortfolioResource
from resources.Skills import PublicSkillsResource

from resources.Job import (
    CreateJobResource,
    MatchingWorkersResource,
    RequestWorkerResource,
    AcceptJobResource,
    RejectJobResource,
    WorkerMarkDoneResource,
    ClientConfirmCompletionResource,
    ClientJobHistoryResource,
    WorkerJobHistoryResource,
    WorkerRequestedJobsResource,
    JobDetailResource
)
from resources.Message import MessageListResource, JobMessagesResource
from resources.Rating import JobRatingResource
from resources.Admin import (
    AdminClientsResource,
    AdminWorkersResource,
    AdminWorkerApplicationsResource,
    AdminApproveRejectWorkerResource,
    AdminSkillsResource,
    AdminJobsResource,
    AdminMessageResource,
    AdminRatingsResource,
    AdminRatingsDeleteResource,
    AdminVerifyWorkerResource,
    AdminDeleteRatingResource,
    AdminDeleteMessageResource
)


#creating the flask application and initializing extensions
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    #attaching the extensions to the app
    db.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}}, supports_credentials=True)
    migrate.init_app(app, db)
    jwt.init_app(app)

    api = Api(app)

    #Authenitication
    api.add_resource(SignupResource, '/auth/register')
    api.add_resource(LoginResource, '/auth/login')

    #Client
    api.add_resource(ClientProfileResource, '/client/profile')

    #Worker
    api.add_resource(WorkerRegisterResource, '/worker/register')
    api.add_resource(WorkerProfileResource, '/worker/profile')
    api.add_resource(WorkerSkillsResource, '/worker/skills')
    api.add_resource(WorkerPortfolioResource, '/worker/portfolio')


    #Job
    api.add_resource(CreateJobResource, '/jobs')
    api.add_resource(MatchingWorkersResource, '/jobs/<int:job_id>/workers')
    api.add_resource(RequestWorkerResource, '/jobs/<int:job_id>/request')
    api.add_resource(AcceptJobResource, '/jobs/<int:job_id>/accept')
    api.add_resource(RejectJobResource, '/jobs/<int:job_id>/reject')
    api.add_resource(WorkerMarkDoneResource, '/jobs/<int:job_id>/worker-complete')
    api.add_resource(ClientConfirmCompletionResource, '/jobs/<int:job_id>/client-complete')
    api.add_resource(ClientJobHistoryResource, '/client/jobs')
    api.add_resource(WorkerJobHistoryResource, '/worker/jobs')
    api.add_resource(WorkerRequestedJobsResource, '/jobs/worker-requests')
    api.add_resource(JobDetailResource, '/jobs/<int:job_id>')

    
    #Messages
    api.add_resource(MessageListResource, '/messages')
    api.add_resource(JobMessagesResource, '/jobs/<int:job_id>/messages')

    #Ratings
    api.add_resource(JobRatingResource, '/jobs/<int:job_id>/rate')
    #Skills
    api.add_resource(AdminSkillsResource, "/admin/skills")
    api.add_resource(PublicSkillsResource, '/skills')


    #ADMIN
    # Clients
    api.add_resource(AdminClientsResource, '/admin/clients')

    # Workers
    api.add_resource(AdminWorkersResource, '/admin/workers')
    api.add_resource(AdminWorkerApplicationsResource, '/admin/workers/applications')
    api.add_resource(AdminApproveRejectWorkerResource, '/admin/workers/<int:worker_id>/<string:action>')  # approve/reject
    api.add_resource(AdminVerifyWorkerResource, '/admin/workers/<int:worker_id>/verify')

    # Jobs
    api.add_resource(AdminJobsResource, '/admin/jobs')

    # Messages
    api.add_resource(AdminMessageResource, '/admin/messages')
    api.add_resource(AdminDeleteMessageResource, '/admin/messages/<int:message_id>/delete')

    # Ratings
    api.add_resource(AdminRatingsResource, '/admin/ratings')
    api.add_resource(AdminRatingsDeleteResource, '/admin/ratings/<int:rating_id>/delete')


    @app.route('/')
    def hello():
        return "Hire Her!"

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
