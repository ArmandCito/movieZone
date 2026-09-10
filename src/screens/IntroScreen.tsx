import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useFonts, Afacad_400Regular, Afacad_700Bold} from '@expo-google-fonts/afacad'
import { GlassCard, GlassButton } from '../components/glass';
import { colors, radii } from '../theme/glass';


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
        <GlassCard style={styles.content} radius={radii.xl} intensity={72}>
          <Text style={styles.title}>
            Movie
            <Text style={styles.titleRed}>Zone</Text>
          </Text>
          <Text style={styles.subtitle}>
            Your number one movie destination...
          </Text>
          <GlassButton
            label="Watch Movies"
            variant="primary"
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          />
        </GlassCard>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Afacad_400Regular',
    color: colors.textPrimary,
    marginBottom: 12,
    fontStyle: 'normal',
  },
  titleRed: {
    color: colors.accent,
    fontFamily: 'Afacad_700Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Afacad_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    paddingHorizontal: 48,
  },
});
