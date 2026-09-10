import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import GlassSurface from './GlassSurface';
import { colors, radii } from '../../theme/glass';

type GlassButtonProps = TouchableOpacityProps & {
  label?: string;
  variant?: 'primary' | 'glass' | 'danger';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
};

const TINTS: Record<string, string> = {
  primary: 'rgba(229,9,20,0.38)',
  glass: colors.glassFillStrong,
  danger: 'rgba(255,93,93,0.32)',
};

/** Pill/rounded button rendered as a tinted glass surface, replacing flat colored buttons. */
export default function GlassButton({
  label,
  variant = 'glass',
  loading = false,
  disabled,
  style,
  textStyle,
  children,
  ...rest
}: GlassButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[disabled && styles.disabled, style]}
      {...rest}
    >
      <GlassSurface
        radius={radii.md}
        tintColor={TINTS[variant]}
        intensity={30}
        style={styles.surface}
      >
        {loading ? (
          <ActivityIndicator color={colors.textPrimary} size="small" />
        ) : children ? (
          children
        ) : (
          <Text style={[styles.text, textStyle]}>{label}</Text>
        )}
      </GlassSurface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  surface: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  disabled: {
    opacity: 0.55,
  },
});
