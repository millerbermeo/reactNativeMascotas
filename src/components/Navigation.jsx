import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native'; // Importa el componente Image

import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterUserScreen from '../screens/RegisterUserScreen';
import RegisterPetScreen from '../screens/RegisterPetScreen';
import AdopScreen from '../screens/AdopScreen';
import AdoptionScreen from '../screens/AdoptionScreen';
import { AuthContext } from '../components/AuthContext';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const { authState } = useContext(AuthContext);

  // Define las URLs de las imágenes para cada tab
  const iconUrls = {
    Home: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', // Reemplaza con la URL real
    Login: 'https://cdn-icons-png.flaticon.com/512/272/272456.png', // Reemplaza con la URL real
    Adopciones: 'https://cdn-icons-png.flaticon.com/512/66/66364.png', // Reemplaza con la URL real
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconUrl;

          if (route.name === 'Home') {
            iconUrl = iconUrls.Home;
          } else if (route.name === 'Login') {
            iconUrl = iconUrls.Login;
          } else if (route.name === 'Adopciones') {
            iconUrl = iconUrls.Adopciones;
          }

          return <Image source={{ uri: iconUrl }} style={{ width: size, height: size, tintColor: color }} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      {!authState.token && (
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
      {authState.token && (
        <Tab.Screen
          name="Adopciones"
          component={AdoptionScreen}
          options={{ headerShown: false }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterUser"
          component={RegisterUserScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="RegisterPet"
          component={RegisterPetScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Adoptar"
          component={AdopScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
