from flask import Flask
from extensions import db, migrate, cors, jwt
from dotenv import load_dotenv
import os

#load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)

    #config from environment
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    #initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    jwt.init_app(app)


    @app.route('/')
    def index():
        return {"message": "Welcome to HireHerHands API"}
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
