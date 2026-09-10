import React, { useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signUpWithEmail, formatFirebaseError } from '../services/firebaseService';
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setError('');

    if (!name || !surname || !email || !phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!agreed) {
      setError('You must accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      const displayName = `${name} ${surname}`.trim();
      await signUpWithEmail(email, password, displayName);

      Alert.alert(
        'Account Created',
        'Your account has been created successfully. You can now sign in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (err: any) {
      setError(formatFirebaseError(err.message));
    } finally {
      setIsLoading(false);
    }
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

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Lets get you started and create your account
            </Text>

            <GlassCard style={styles.form} radius={radii.xl}>
              <GlassCard style={styles.inputWrapper} radius={radii.md} intensity={20} padded={false}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </GlassCard>
              <GlassCard style={styles.inputWrapper} radius={radii.md} intensity={20} padded={false}>
                <TextInput
                  style={styles.input}
                  placeholder="Surname"
                  placeholderTextColor={colors.textMuted}
                  value={surname}
                  onChangeText={setSurname}
                />
              </GlassCard>
              <GlassCard style={styles.inputWrapper} radius={radii.md} intensity={20} padded={false}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </GlassCard>
              <GlassCard style={styles.inputWrapper} radius={radii.md} intensity={20} padded={false}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor={colors.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
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

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreed(!agreed)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                  {agreed && <Ionicons name="checkmark" size={14} color={colors.textPrimary} />}
                </View>
                <Text style={styles.checkboxText}>
                  Yes, I understand and agree to the Moviezone{' '}
                  <Text style={styles.checkboxLink}>Terms of Service</Text>, including
                  the <Text style={styles.checkboxLink}>User Agreement and Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <GlassButton
                label="Sign Up"
                variant="primary"
                loading={isLoading}
                style={styles.signInButton}
                onPress={handleSignUp}
              />

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or sign up with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialRow}>
                <GlassCard style={styles.socialButton} radius={radii.md} intensity={25} padded={false}>
                  <TouchableOpacity style={styles.socialButtonTouch}>
                    <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                  </TouchableOpacity>
                </GlassCard>
                <GlassCard style={styles.socialButton} radius={radii.md} intensity={25} padded={false}>
                  <TouchableOpacity style={styles.socialButtonTouch}>
                    <Ionicons name="logo-google" size={22} color="#DB4437" />
                  </TouchableOpacity>
                </GlassCard>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.registerRow}
              >
                <Text style={styles.registerText}>
                  Already have an account? <Text style={styles.registerLink}>Sign In</Text>
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
    paddingTop: 32,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
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
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 14,
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
    marginBottom: 16,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.textMuted,
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  checkboxLink: {
    color: colors.accent,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  signInButton: {
    marginTop: 8,
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
