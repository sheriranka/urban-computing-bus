import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";
import MapView, {Marker, Polyline} from 'react-native-maps';

function CustomMarker(value) {
  return (
    <View style={styles.marker}>
      <Text style={styles.color}>{value}</Text>
    </View>
  );
}

export default function Map_screen() {

  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [time, setTime] = useState(null);
  const [load, setLoad] = useState(false);

  const [start_stop, setStartStop] = useState(null);
  const [end_stop, setEndStop] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);

  const [load2, setLoad2] = useState(false)
  const [load3, setLoad3] = useState(false)

  const [eta, setETA] = useState(null)
  const [eta_start_stop, setETA_Start_Stop] = useState(null)

  const [timeETA, setTimeETA] = useState(null)
  const [timeArr, setTimeArr] = useState(null)

  const getETA = async (data) => {
    try {
      const response = await fetch('https://bus-api-oqbw.onrender.com/bus/get_eta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error');
      }

      const responseData = await response.json();
      console.log(responseData);

      // time taken from previous stop
      var prev_eta = responseData[0].eta_prev
      // estimated eta a whole route
      var eta_v = responseData[1].eta
      // eta from start to end stop
      var eta_start_stop_v = responseData[2].eta_s_e

      setETA(String(Math.floor((prev_eta % 3600) / 60)) + ":" + String(Math.floor(prev_eta % 60)) + " - " + String(Math.floor((eta_v % 3600) / 60)) + ":" + String(Math.floor(eta_v % 60)) + " min");


      setETA_Start_Stop(String(Math.floor((eta_start_stop_v % 3600) / 60)) + ":" + String(Math.floor(eta_start_stop_v % 60)) + " min");

      var nowTime = new Date();

      prev_eta = new Date(prev_eta * 1000)
      eta_v = new Date(eta_v * 1000)
      eta_start_stop_v = new Date(eta_start_stop_v * 1000)


      var timePrevStop = new Date(prev_eta.getTime() + nowTime.getTime())
      var timeFullRoute = nowTime.getTime() + eta_v.getTime()
      var timeToArrive = new Date(timeFullRoute + eta_start_stop_v.getTime())
      timeFullRoute = new Date(timeFullRoute)

      const stringTimePrevArr = timePrevStop.toLocaleTimeString('en-PR')
      const stringTimeETA = timeFullRoute.toLocaleTimeString('en-PR')
      const stringArrivalToStop = timeToArrive.toLocaleTimeString('en-PR')

      setTimeETA(stringTimePrevArr + " - "+ stringTimeETA)
      setTimeArr(stringArrivalToStop)


      setLoad2(false)
      Alert.alert('ETA Info', "Received data", [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const GetLocation = async () => {

      try {
        const response = await fetch('https://bus-api-oqbw.onrender.com/bus/get_bus', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Error');
        }
  
        const responseData = await response.json();
        //console.log(responseData); 
        setLat(Number(responseData.lat))
        setLon(Number(responseData.lon))
        setTime(responseData.time)
        setLoad(true)
        
      } catch (error) {
        console.error('Error:', error);
      }

  }

  useEffect(() => {
    GetLocation()
  }, [])

  const pinMark = 
    [{
      key: 4,
      title: 'Parada 4: Ciencias Naturales',
      coordinates: {
        latitude: 18.403636,
        longitude: -66.045492
      },
    },
    {
      key: 5,
      title: 'Parada 5: Paseo Peatonal',
      coordinates: {
        latitude: 18.403751,
        longitude: -66.046593
      },  
    },
    {
      key: 6,
      title: 'Parada 6: Parque del Centenario',
      coordinates: {
        latitude: 18.403879,
        longitude: -66.048199
      },  
    },
    {
      key: 13,
      title: 'Parada 13: Biblioteca Lazaro',
      coordinates: {
        latitude: 18.403955,
        longitude: -66.049898
      },  
    },
  
    {
      key: 24,
      title: 'Parada 24: Hogar Masonico',
      coordinates: {
        latitude: 18.404698,
        longitude: -66.050468
      },  
    },
    {
      key: 23,
      title: 'Parada 23: Estacionamiento Sociales',
      coordinates: {
        latitude: 18.406440,
        longitude: -66.050140
      },  
    },
    {
      key: 20,
      title: 'Parada 20: Estacionamiento Derecho',
      coordinates: {
        latitude: 18.407062,
        longitude: -66.049323
      },  
    },
    {
      key: 19,
      title: 'Parada 19: Administracion de Empresas',
      coordinates: {
        latitude: 18.406503,
        longitude: -66.048520
      },  
    },
    {
      key: 9, 
      title: 'Parada 9: Cuatro Grandes',
      coordinates: {
        latitude: 18.406018,
        longitude: -66.047806
      },  
    },
    {
      key: 10,
      title: 'Parada 10: Complejo Deportivo',
      coordinates: {
        latitude: 18.406766,
        longitude: -66.046771
      },  
    },
    {
      key: 11,
      title: 'Parada 11: Talleres',
      coordinates: {
        latitude: 18.406078,
        longitude: -66.044770
      },  
    },
    {
      key: 2,
      title: 'Parada 2: ROTC Entrada',
      coordinates: {
        latitude: 18.406243,
        longitude: -66.043161
      },  
    },
    {
      key: 1,
      title: 'Parada 1: ROTC Estacionamiento',
      coordinates: {
        latitude: 18.407170,
        longitude: -66.041989
      },  
    },
    {
      key: 3,
      title: 'Parada 3: Estudios Generales',
      coordinates: {
        latitude: 18.404856,
        longitude: -66.044836
      },  
    }]
  

  const polylines = [
    {
      coordinates: [

      // Natu hasta Lazaro
      { latitude: 18.403552, longitude: -66.044974 },
      { latitude: 18.403720, longitude: -66.046592 },
      { latitude: 18.403890, longitude: -66.048240}, 
      { latitude: 18.403937, longitude: -66.049896}, 

      // Lazaro hasta Derecho
      { latitude: 18.403956, longitude: -66.050460}, 
      { latitude: 18.404632, longitude: -66.050420}, 
      { latitude: 18.405285, longitude: -66.050411}, 
      { latitude: 18.405765, longitude: -66.050395}, 
      { latitude: 18.406016, longitude: -66.050357}, 
      { latitude: 18.406492, longitude: -66.050113}, 
      { latitude: 18.407238, longitude: -66.049564}, 
      { latitude: 18.406014, longitude: -66.047805}, 


      // Derecho a ROTC y de ROTC a Natu
      { latitude: 18.406669, longitude: -66.047320 },
      { latitude: 18.406803, longitude: -66.046946 },
      { latitude: 18.406076, longitude: -66.044921 },
      { latitude: 18.406204, longitude: -66.042855},
      { latitude: 18.406628, longitude: -66.042422},
      { latitude: 18.406971, longitude: -66.042216},
      { latitude: 18.407073, longitude: -66.041953},
      { latitude: 18.407073, longitude: -66.041953},
      { latitude: 18.406971, longitude: -66.042216},
      { latitude: 18.406628, longitude: -66.042422},
      { latitude: 18.406204, longitude: -66.042855},
      { latitude: 18.406143, longitude: -66.043908},
      { latitude: 18.404845, longitude: -66.043803},
      { latitude: 18.404830, longitude: -66.044388},
      { latitude: 18.404859, longitude: -66.044872},
      { latitude: 18.404090, longitude: -66.044921},
      { latitude: 18.403552, longitude: -66.044974 },
      ],
      strokeColor: "#FF5E5E"
    },

  ];

  const time_slot = [
    {
      key: 8,
      value: "Time Slot 8 (8:00am - 8:59am)"
    },
    {
      key :9,
      value: "Time Slot 9 (9:00am - 9:59am)"
    },
    {
      key :10,
      value: "Time Slot 10 (10:00am - 10:59am)"
    },
    {
      key :11,
      value: "Time Slot 11 (11:00am - 11:59am)"
    },
    /*{
      key :12,
      value: "Time Slot 12 (12:00pm - 12:59pm)"
    },
    {
      key :13,
      value: "Time Slot 13 (1:00pm - 1:59pm)"
    },*/
    //{
    //  key :14,
   //   value: "Time Slot 14 (2:00pm - 2:59pm)"
    //},
   
  ]


  const paradas = [{
    key: 4,
    value: 'Parada 4: Ciencias Naturales'
  },
  {
    key: 5,
    value: 'Parada 5: Paseo Peatonal'
  },
  {
    key: 6,
    value: 'Parada 6: Parque del Centenario'
  },
  {
    key: 13,
    value: 'Parada 13: Biblioteca Lazaro'
  },

  {
    key: 24,
    value: 'Parada 24: Hogar Masonico'
  },
  {
    key: 23,
    value: 'Parada 23: Estacionamiento Sociales'
  },
  {
    key: 20,
    value: 'Parada 20: Estacionamiento Derecho'
  },
  {
    key: 19,
    value: 'Parada 19: Administracion de Empresas'
  },
  {
    key: 9, 
    value: 'Parada 9: Cuatro Grandes'
  },
  {
    key: 10,
    value: 'Parada 10: Complejo Deportivo'
  },
  {
    key: 11,
    value: 'Parada 11: Talleres'
  },
  {
    key: 2.1,
    value: 'Parada 2: ROTC Entrada'
  },
  {
    key: 1,
    value: 'Parada 1: ROTC Estacionamiento'
  },
  //{
   // key: 2.2,
  //  value: 'Parada 2: ROTC Entrada (Hacia Estudios Generales)'
 //},
  {
    key: 3,
    value: 'Parada 3: Estudios Generales'
  }]

  //console.log("aqui")
  
  return (
    
    <View style={styles.container }>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.404578,
          longitude: -66.048224,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        //followsUserLocation={true}
        showsMyLocationButton={true}
      >
      {pinMark.map(marker => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinates}
            title={marker.title}
          >
          {CustomMarker(marker.key)}
          </Marker>
        ))}
        {polylines.map((coords, index) => (
          <Polyline
            key={index}
            coordinates={coords.coordinates}
            strokeColor={coords.strokeColor}
            strokeWidth={4}
          />
        ))}

        {load && <Marker coordinate={{latitude: lat, longitude: lon}} title="Bus last seen here" description={'Last time: '+ time}/>}
      </MapView>

      <ScrollView>

  
      <Text style={styles.text4}>ETA Stop {start_stop}: {eta}</Text>
      <Text style={styles.text4}>Time to Stop {start_stop}: {timeETA}</Text>
      <Text style={styles.text4}>ETA Stop {start_stop} to Stop {end_stop}: {eta_start_stop}</Text>
      <Text style={styles.text4}>Time to Stop {end_stop}: {timeArr}</Text>

      {/*<Text style={[styles.text3, {marginTop:"10%"}]}>Select start and end stop for ETA:</Text>*/}

      <View style={styles.select}>
        <SelectList
              boxStyles={[{ backgroundColor: 'white', borderColor: "white" }]}
              dropdownStyles={[{ backgroundColor: 'white', borderColor: "white" }]}
              data={paradas}
              setSelected={setStartStop}
              placeholder="Select start stop"
              save="key"
            />
      </View>

      <View style={styles.select}>
      <SelectList
              boxStyles={[{ backgroundColor: 'white', borderColor: "white" }]}
              dropdownStyles={[{ backgroundColor: 'white', borderColor: "white" }]}
              data={paradas}
              setSelected={setEndStop}
              placeholder="Select end stop"
              save="key"
            />
      </View>

      <View style={styles.select}>
      <SelectList
              boxStyles={[{ backgroundColor: 'white', borderColor: "white" }]}
              dropdownStyles={[{ backgroundColor: 'white', borderColor: "white" }]}
              data={time_slot}
              setSelected={setTimeSlot}
              placeholder="Select time slot"
              save="key"
            />
      </View>


      <TouchableOpacity
          style={styles.button}
          onPress={() => {  
              if(start_stop === null){
                Alert.alert("A start stop needs to be selected")
              }
              else if(end_stop === null){
                Alert.alert("A end stop needs to be selected")
              }
              else if(timeSlot === null){
                Alert.alert("A time slot needs to be selected")
              }
              else{

               
                setLoad2(true)
                
                getETA(
                 {"stop": start_stop, "end_stop": end_stop, "time_slot": timeSlot}
                )
              }
            }
          }
            >
          <Text style={styles.text2}>Get ETA</Text>
      </TouchableOpacity>

      <View>

           {load2 == true && (<ActivityIndicator/>)}

      </View>

      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '40%',
  },
  marker: {
    width: 20,
    height: 20,
    backgroundColor: "#FFAFAF",
    borderColor: "black",
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: "white",
    fontSize: 5, 
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  text3: {
    marginTop: "5%",
    fontSize: 20,
    lineHeight: 21,
    marginLeft: "10%",
    marginRight: "10%",
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  text4: {
    marginTop: "5%",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 250,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#009688",
    marginTop: "5%",
  },
  select: {
    margin: 12,
    marginLeft: "10%",
    marginRight: "10%"
  }
});
