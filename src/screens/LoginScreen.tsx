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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmail, formatFirebaseError } from '../services/firebaseService';
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import SocialAuthButtons from '../components/SocialAuthButtons';
import { colors, radii } from '../theme/glass';

export default function LoginScreen({ navigation }: any) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialBusy, setSocialBusy] = useState(false);

  const handleSignIn = async () => {
    if (isLoading || socialBusy) return;
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(identifier, password);
    } catch (err: unknown) {
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LiquidBackground>
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
              <GlassCard style={styles.inputWrapper} radius={radii.md} intensity={55} padded={false}>
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

              <GlassCard style={styles.passwordWrapper} radius={radii.md} intensity={55} padded={false}>
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
                disabled={socialBusy}
                style={styles.signInButton}
                onPress={handleSignIn}
              />

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or sign in with</Text>
                <View style={styles.divider} />
              </View>

              <SocialAuthButtons onError={setError} disabled={isLoading} onBusyChange={setSocialBusy} />

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
      </LiquidBackground>
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
