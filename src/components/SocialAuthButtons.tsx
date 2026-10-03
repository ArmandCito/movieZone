import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { formatFirebaseError } from '../services/firebaseService';
import { GlassCard } from './glass';
import { radii } from '../theme/glass';

type Provider = 'facebook' | 'google';

interface SocialAuthButtonsProps {
  onError: (message: string) => void;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
  beforeSignIn?: () => boolean;
}

export default function SocialAuthButtons({ onError, disabled: externallyDisabled, onBusyChange, beforeSignIn }: SocialAuthButtonsProps) {
  const { signInWithFacebook, signInWithGoogle } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const inFlight = useRef(false);

  const handleProvider = async (provider: Provider) => {
    if (inFlight.current || externallyDisabled) return;
    if (beforeSignIn && !beforeSignIn()) return;
    inFlight.current = true;
    onError('');
    setLoadingProvider(provider);
    onBusyChange?.(true);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithFacebook();
      }
    } catch (error) {
      onError(formatFirebaseError(error));
    } finally {
      inFlight.current = false;
      setLoadingProvider(null);
      onBusyChange?.(false);
    }
  };

  const disabled = externallyDisabled || loadingProvider !== null;

  return (
    <View style={styles.socialRow}>
      <GlassCard
        style={[styles.socialButton, disabled && styles.buttonDisabled]}
        radius={radii.md}
        intensity={58}
        padded={false}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Continue with Facebook"
          style={styles.socialButtonTouch}
          onPress={() => handleProvider('facebook')}
          disabled={disabled}
        >
          {loadingProvider === 'facebook' ? (
            <ActivityIndicator color="#1877F2" size="small" />
          ) : (
            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
          )}
        </TouchableOpacity>
      </GlassCard>

      <GlassCard
        style={[styles.socialButton, disabled && styles.buttonDisabled]}
        radius={radii.md}
        intensity={58}
        padded={false}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          style={styles.socialButtonTouch}
          onPress={() => handleProvider('google')}
          disabled={disabled}
        >
          {loadingProvider === 'google' ? (
            <ActivityIndicator color="#DB4437" size="small" />
          ) : (
            <Ionicons name="logo-google" size={22} color="#DB4437" />
          )}
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
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
  buttonDisabled: {
    opacity: 0.6,
  },
});
