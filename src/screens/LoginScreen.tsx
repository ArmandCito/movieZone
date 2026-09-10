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
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

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
    <View style={styles.root}>
      <LiquidBackground />
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

            <GlassCard style={styles.form} radius={radii.xl}>
              <GlassCard style={styles.inputWrapper} radius={radii.md} intensity={20} padded={false}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </GlassCard>

              <GlassCard style={styles.passwordWrapper} radius={radii.md} intensity={20} padded={false}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor={colors.textMuted}
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
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </GlassCard>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <GlassButton
                label="Sign In"
                variant="primary"
                loading={isLoading}
                style={styles.signInButton}
                onPress={handleSignIn}
              />

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or sign in with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialRow}>
                <GlassCard style={styles.socialButton} radius={radii.md} intensity={25} padded={false}>
                  <TouchableOpacity style={styles.socialButtonTouch}>
                    <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                  </TouchableOpacity>
                </GlassCard>
                <GlassCard
                  style={[styles.socialButton, googleLoading && styles.buttonDisabled]}
                  radius={radii.md}
                  intensity={25}
                  padded={false}
                >
                  <TouchableOpacity
                    style={styles.socialButtonTouch}
                    onPress={handleGoogleSignIn}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <ActivityIndicator color="#DB4437" size="small" />
                    ) : (
                      <Ionicons name="logo-google" size={22} color="#DB4437" />
                    )}
                  </TouchableOpacity>
                </GlassCard>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.registerRow}
              >
                <Text style={styles.registerText}>
                  Not registered yet? <Text style={styles.registerLink}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBottom,
  },
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 40,
  },
  logoRed: {
    color: colors.accent,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: colors.textPrimary,
    fontSize: 14,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    color: colors.textPrimary,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  signInButton: {
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.glassBorderSoft,
  },
  dividerText: {
    color: colors.textMuted,
    marginHorizontal: 12,
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    marginHorizontal: 8,
  },
  socialButtonTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerRow: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  registerLink: {
    color: colors.accent,
    fontWeight: '600',
  },
});