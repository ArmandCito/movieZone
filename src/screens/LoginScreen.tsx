import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmail, signInWithGoogleToken, formatFirebaseError } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = '103725081854-uaif6d4nk0de4i9li8r85qqfs2o3f0vh.apps.googleusercontent.com';

export default function LoginScreen({ navigation }: any) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { setUser } = useAuth();

  const handleSignIn = async () => {
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const authResponse = await signInWithEmail(identifier, password);
      handleAuthSuccess(authResponse);
    } catch (err: any) {
      setError(formatFirebaseError(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (authResponse: any) => {
    setUser({
      localId: authResponse.localId,
      email: authResponse.email,
      displayName: authResponse.displayName,
      idToken: authResponse.idToken,
      refreshToken: authResponse.refreshToken,
    });
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      // Load Google Identity Services script
      await loadGoogleScript();
      const google = (window as any).google;
      if (!google?.accounts?.id) {
        throw new Error('GOOGLE_LOAD_FAILED');
      }

      await new Promise<void>((resolve, reject) => {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            try {
              const credential = response?.credential;
              if (!credential) throw new Error('No credential received');
              const authData = await signInWithGoogleToken(credential);
              handleAuthSuccess(authData);
              resolve();
            } catch (err: any) {
              setError(formatFirebaseError(err.message));
              reject(err);
            }
          },
          auto_select: false,
        });

        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setError('Google sign-in cancelled or blocked. Please try again.');
            reject(new Error('POPUP_BLOCKED'));
          }
        });
      });
    } catch (err: any) {
      setError(formatFirebaseError(err.message));
    } finally {
      setGoogleLoading(false);
    }
  };

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }
      if ((window as any).google?.accounts?.id) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.logo}>
            Movie<Text style={styles.logoRed}>Zone</Text>
          </Text>

          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Please sign in to your account to continue
          </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8A8A8A"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#8A8A8A"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#8A8A8A"
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or sign in with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={22} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, googleLoading && styles.buttonDisabled]}
                onPress={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator color="#DB4437" size="small" />
                ) : (
                  <Ionicons name="logo-google" size={22} color="#DB4437" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.registerRow}
            >
              <Text style={styles.registerText}>
                Not registered yet? <Text style={styles.registerLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  logoRed: {
    color: '#E50914',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#262626',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    fontSize: 14,
  },
  passwordWrapper: {
    backgroundColor: '#262626',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#E50914',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  signInButton: {
    backgroundColor: '#E50914',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  dividerText: {
    color: '#8A8A8A',
    marginHorizontal: 12,
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    backgroundColor: '#FFFFFF',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  registerRow: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  registerLink: {
    color: '#E50914',
    fontWeight: '600',
  },
});