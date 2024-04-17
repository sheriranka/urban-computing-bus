import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
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
        console.log(responseData); 
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
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
});
