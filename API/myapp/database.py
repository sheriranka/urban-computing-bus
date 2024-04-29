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
    stop_id = db.Column(db.Integer)
    time_slot = db.Column(db.Integer)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    eta = db.Column(db.Float)