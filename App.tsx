import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import IntroScreen from './src/screens/IntroScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import { useFonts, Afacad_400Regular, Afacad_700Bold } from '@expo-google-fonts/afacad';

const Stack = createNativeStackNavigator();

export default function App() {

  let [fontsLoaded] = useFonts({
      Afacad_400Regular,
      Afacad_700Bold
    });
  
  if (!fontsLoaded) {
      return (null); 
    }
  
  return (
    <SafeAreaProvider >
      <View style={styles.container}>
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
        </Stack.Navigator>
      </NavigationContainer>
      </View>
    
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Afacad_400Regular',
    backgroundColor: '#121212',
  },
});
