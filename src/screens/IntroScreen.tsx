import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useFonts, Afacad_400Regular, Afacad_700Bold} from '@expo-google-fonts/afacad'


export default function IntroScreen({ navigation }: any) {

  let [fontsLoaded] = useFonts({
    Afacad_400Regular,
    Afacad_700Bold
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://plus.unsplash.com/premium_photo-1684923604860-64e661f2ff72?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Movie
            <Text style={styles.titleRed}>Zone</Text>
          </Text>
          <Text style={styles.subtitle}>
            Your number one movie destination...
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Watch Movies</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 12, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',

  },
  content: {
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontFamily: 'Afacad_400Regular',
    // fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    fontStyle: 'normal',
  },
  titleRed: {
    color: '#E50914',
    fontFamily: 'Afacad_700Bold',
    // fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Afacad_400Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#E50914',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Afacad_400Regular',
  },
});
