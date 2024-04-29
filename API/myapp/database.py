from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Bus(db.Model):
    location_id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    acceleration = db.Column(db.Float)
    time = db.Column(db.Text)

class ETA(db.Model):
    #__table_args__ = {'extended_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    stop_id = db.Column(db.Float)
    time_slot = db.Column(db.Integer)
    eta_bus = db.Column(db.Float)