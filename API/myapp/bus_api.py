from flask import Blueprint, request, jsonify, render_template, current_app, url_for, redirect, Flask, make_response
from .database import db, Bus, ETA
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


@bus.route('/get_eta', methods=['POST'])
def get_eta():
    data = request.json
    stop = data['stop']
    end_stop = data['end_stop']
    time_slot = data['time_slot']
    
    if stop is None or time_slot is None:
        return jsonify({"message": "Select stop and a time slot"}), 400

    row =  ETA.query.filter_by(time_slot=time_slot).all()

    eta_no_bus = 0

    route = [4, 5, 6, 13, 24, 23, 20, 19, 9, 10, 11, 2.1, 1, 3]

    eta_dict = {}

    for r in row:
        eta_dict[r.stop_id] = r
        eta_no_bus += r.eta_bus

    ind = route.index(stop)

    st = route[ind]

    last_stop = route[ind - 1]

    last_stop_time = eta_dict[float(last_stop)].eta_bus

    eta_start_end = 0

    while st != end_stop:
        ind += 1

        if(ind == len(route)):
            ind = 0

        st = route[ind]

        eta_start_end += eta_dict[float(st)].eta_bus

    return jsonify({"eta_prev": last_stop_time},{"eta": eta_no_bus}, {"eta_s_e": eta_start_end}), 201


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