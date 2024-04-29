from flask import Flask, render_template, url_for, redirect, request
from datetime import timedelta
import os
from .database import db, Bus, ETA
from .bus_api import bus


def create_app():

    app = Flask(__name__)

    # load the instance config, if it exists, when not testing
    app.config.from_mapping(
                SECRET_KEY='dev',
                SQLALCHEMY_DATABASE_URI= os.environ.get('DATABASE_URL'),
                SQLALCHEMY_TRACK_MODIFICATIONS=False)
    #postgresql://bus_project_b26c_user:OYPYVubg813DrqOt5wjoIGK1UfuS703b@dpg-cnsdvoud3nmc73aocdug-a.oregon-postgres.render.com/bus_project_b26c

    #db.app = application
    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(bus)

