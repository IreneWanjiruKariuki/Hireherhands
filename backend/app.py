from flask import Flask
from config import Config
from extensions import db, bcrypt, cors, migrate, jwt
from models import *
from resources.Authentication import SignupResource, LoginResource
from resources.Job import (
    CreateJobResource,
    MatchingWorkersResource,
    RequestWorkerResource,
    AcceptJobResource,
    RejectJobResource,
    WorkerMarkDoneResource,
    ClientConfirmCompletionResource
)
from flask_restful import Api

#creating the flask application and initializing extensions
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    #attaching the extensions to the app
    db.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})
    migrate.init_app(app, db)
    jwt.init_app(app)

    api = Api(app)

    api.add_resource(SignupResource, '/auth/register')
    api.add_resource(LoginResource, '/auth/login')
    api.add_resource(CreateJobResource, '/jobs')
    api.add_resource(MatchingWorkersResource, '/jobs/<int:job_id>/workers')
    api.add_resource(RequestWorkerResource, '/jobs/<int:job_id>/request')
    api.add_resource(AcceptJobResource, '/jobs/<int:job_id>/accept')
    api.add_resource(RejectJobResource, '/jobs/<int:job_id>/reject')
    api.add_resource(WorkerMarkDoneResource, '/jobs/<int:job_id>/worker-complete')
    api.add_resource(ClientConfirmCompletionResource, '/jobs/<int:job_id>/client-complete')



    @app.route('/')
    def hello():
        return "Hire Her!"

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
