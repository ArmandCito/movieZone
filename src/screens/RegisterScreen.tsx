import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usersArray } from '../data/mockData';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = () => {
    setError('');

    if (!name || !surname || !email || !phone || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!agreed) {
      setError('Vous devez accepter les termes et conditions');
      return;
    }

    const newUser = { name, surname, email, phone, password };
    usersArray.push(newUser);

    Alert.alert(
      'Compte créé',
      'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.logo}>
            Movie<Text style={styles.logoRed}>zone</Text>
          </Text>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Lets get you started and create your account
          </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#8A8A8A"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Surname"
              placeholderTextColor="#8A8A8A"
              value={surname}
              onChangeText={setSurname}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8A8A8A"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#8A8A8A"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
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

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxText}>
                Yes, I understand and agree to the Moviezone{' '}
                <Text style={styles.checkboxLink}>Terms of Service</Text>, including
                the <Text style={styles.checkboxLink}>User Agreement and Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.signInButton} onPress={handleSignUp}>
              <Text style={styles.signInButtonText}>Sign In</Text>
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
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={22} color="#DB4437" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
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
    paddingTop: 32,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
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
    marginBottom: 24,
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
    marginBottom: 14,
    fontSize: 14,
  },
  passwordWrapper: {
    backgroundColor: '#262626',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 16,
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
    borderColor: '#8A8A8A',
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  checkboxText: {
    flex: 1,
    color: '#AAAAAA',
    fontSize: 12,
    lineHeight: 18,
  },
  checkboxLink: {
    color: '#E50914',
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
    marginTop: 8,
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
