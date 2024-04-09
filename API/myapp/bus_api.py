from flask import Blueprint, request, jsonify, render_template, current_app, url_for, redirect, Flask, make_response
from .database import db, Bus
import json
import os
import uuid
from sqlalchemy import text
import pandas as pd

bus = Blueprint('bus', __name__, url_prefix='/bus')


# Route to receive GPS data
@bus.route('/add_bus', methods=['POST'])
def receive_gps_data():
    data = request.json
    lat = data['lat']
    lon = data['lon']
    time = data['time']
    acceleration = data['acceleration']

    new_row = Bus(
        latitude=lat,
        longitude=lon,
        acceleration=acceleration,
        time=time
    )

    db.session.add(new_row)
    db.session.commit()

    return jsonify({"message": "GPS data received and saved successfully"}), 201

@bus.route('/get_bus', methods=['GET'])
def get_latest_gps_data():
    
    #query = text("SELECT * FROM bus ORDER BY location_id DESC LIMIT 1")

    #row = db.engine.execute(query).fetchone()

    row = Bus.query.all()

    row = row[-1]

    if row:
        data = {
            'id': row.location_id,
            'lat': row.latitude,
            'lon': row.longitude,
            'time': row.time,
            'acceleration': row.acceleration
        }
        return jsonify(data), 200
    else:
        return jsonify({"message": "No GPS data found"}), 404


@bus.route('/get_all', methods=['GET'])
def get_gps_data():
    
    #query = text("SELECT * FROM bus ORDER BY location_id DESC LIMIT 1")

    #row = db.engine.execute(query).fetchone()

    row = Bus.query.all()

    #data_return = []

    df = pd.DataFrame(columns=['id','lat','lon','time','acce'])

    if row:

        for bus in row:
            #data = {
            #    'id': bus.location_id,
            #    'lat': bus.latitude,
            #    'lon': bus.longitude,
            #    'time': bus.time,
            #    'acceleration': bus.acceleration
            #}
            data = [bus.location_id, bus.latitude, bus.longitude, bus.time, bus.acceleration]
            df.loc[len(df.index)] = data
            #data_return.append(data)

        csv_df = df.to_csv(index=False)

        resp = make_response(csv_df)

        cd = 'attachment; filename=bus.csv'
        resp.headers['Content-Disposition'] = cd 
        resp.mimetype='text/csv'

        return resp
      
        #return jsonify(data_return), 200
    else:
        return jsonify({"message": "No GPS data found"}), 404