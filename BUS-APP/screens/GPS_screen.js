import { StatusBar } from 'expo-status-bar';
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function GPS_screen() {

  const apiCall = async (data) => {
    try {
      const response = await fetch('https://bus-api-oqbw.onrender.com/bus/add_bus', {
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
      setLoad2(false)
      Alert.alert('Bus Info', 'Bus GPS Location Added to Database', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const currNav = useNavigation();


  const [value, setValue] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [time, setTime] = useState(null);
  const [acceleration, setAcceleration] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);
  const [message, setMessage] = useState(false);
  const [savedLocations, setSavedLocations] = useState(null);
  const [start_stop, setStartStop] = useState(null);
  const [end_stop, setEndStop] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);



  const GetLocation = async (value) => {

      if(value){
        setLoad2(true)
      }
      else{
        setLoad(true)
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude);
      setLon(location.coords.longitude);
      setAcceleration(location.coords.speed);
      const time = new Date(Number(location.timestamp));

      let timestamp = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()

      setTime(timestamp);

      //await AsyncStorage.setItem("lat", String(lat));
      //await AsyncStorage.setItem("lon", String(lon));
  
      //console.log(timestamp);

      if(value){

          apiCall({
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            time: timestamp,
            acceleration: location.coords.speed,
          });


       }
       else{
        setLoad(false)
       }

  };



  const [load, setLoad] = useState(false)
  const [load2, setLoad2] = useState(false)
  
  return (
    <ScrollView>

    <Text style={[styles.text3, {marginTop:"10%"}]}>See Map of IUPI Route</Text>

    <TouchableOpacity
              style={styles.button}
              onPress={() => currNav.navigate("Map")
              }
                >
              <Text style={styles.text}>Map</Text>
          </TouchableOpacity>


      <Text style={[styles.text3, {marginTop:"10%"}]}>Button to get time, location and upload to database:</Text>

      <TouchableOpacity
          style={styles.button}
          onPress={() => {  
              GetLocation(1)
            }
          }
            >
          <Text style={styles.text}>Get Location and Upload to Database</Text>
      </TouchableOpacity>

      <View>

           {load2 == true && (<ActivityIndicator/>)}

      </View>


        
      <Text style={styles.text2}>Lat: {lat}, Long: {lon}, Acceleration: {acceleration}</Text>
      <Text style={styles.text2}>Timestamp: {time}</Text>

  
      <Text style={[styles.text3, {marginTop:"10%"}]}>Button to get current time and location only:</Text>
    
      <TouchableOpacity
          style={styles.button}
          onPress={() => {
              GetLocation(0)
            }
          }
            >
          <Text style={styles.text}>Get Location Only</Text>
      </TouchableOpacity>

      <View>
      
          {load == true && (<ActivityIndicator/>)}

      </View>


     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
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

  text2: {
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
