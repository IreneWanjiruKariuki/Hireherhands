from flask import Flask
from config import Config
from extensions import db, bcrypt, cors
"""
from resources.Authentication import AuthenticationResource
from resources.Job import JobResource
from resources.Client import ClientResource
from resources.Worker import WorkerResource
from resources.Admin import AdminResource
from resources.Rating import RatingResource
"""
from flask_restful import Api

#creating the flask application and initializing extensions
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    #attaching the extensions to the app
    db.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)

    api = Api(app)

    """registering resources
    api.add_resource(AuthenticationResource, '/auth')
    api.add_resource(JobResource, '/jobs')
    api.add_resource(ClientResource, '/clients')
    api.add_resource(WorkerResource, '/workers')
    api.add_resource(AdminResource, '/admin')
    api.add_resource(RatingResource, '/ratings') """


    @app.route('/')
    def hello():
        return "Hire Her!"

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
