import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import IntroScreen from './src/screens/IntroScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import WatchScreen from './src/screens/WatchScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import SeatBookingScreen from './src/screens/SeatBookingScreen';
import BookingConfirmationScreen from './src/screens/BookingConfirmationScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import MyBookingsScreen from './src/screens/MyBookingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { AuthProvider } from './src/context/AuthContext';
import { UserDataProvider } from './src/context/UserDataContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator
              initialRouteName="Intro"
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#121212' },
              }}
            >
              <Stack.Screen name="Intro" component={IntroScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />

              {/* Watch Online flow */}
              <Stack.Screen name="Watch" component={WatchScreen} />
              <Stack.Screen name="Player" component={PlayerScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />

              {/* Cinema booking flow */}
              <Stack.Screen name="SeatPicker" component={SeatBookingScreen} />
              <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />

              {/* Library / account screens */}
              <Stack.Screen name="Favorites" component={FavoritesScreen} />
              <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}