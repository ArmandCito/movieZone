import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { UserDataProvider } from './src/context/UserDataContext';
import { colors } from './src/theme/glass';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <UserDataProvider key={user?.localId || 'guest'}>
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        key={user ? 'authenticated' : 'guest'}
        initialRouteName={user ? 'Home' : 'Intro'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#08070c' },
        }}
      >
        {user ? (
          <>
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
          </>
        ) : (
          <>
              <Stack.Screen name="Intro" component={IntroScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </UserDataProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgBottom,
  },
});
