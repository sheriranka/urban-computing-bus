import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GPS_screen from './screens/GPS_screen';
import Map_screen from './screens/Map_screen';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
//<Tab.Screen name="Map" component={Map_screen} />
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={GPS_screen} />
        <Stack.Screen name="Map" component={Map_screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}