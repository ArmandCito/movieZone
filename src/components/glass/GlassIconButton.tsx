import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassSurface from './GlassSurface';
import { colors, radii } from '../../theme/glass';

type GlassIconButtonProps = Omit<TouchableOpacityProps, 'children'> & {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  iconColor?: string;
  tintColor?: string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export default function GlassIconButton({
  icon,
  size = 22,
  iconColor = colors.textPrimary,
  tintColor = colors.glassFillStrong,
  radius = radii.md,
  style,
  disabled,
  ...rest
}: GlassIconButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled, style]}
      {...rest}
    >
      <GlassSurface radius={radius} tintColor={tintColor} intensity={58} style={styles.surface}>
        <Ionicons name={icon} size={size} color={iconColor} />
      </GlassSurface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 42, minHeight: 42 },
  surface: {
    minWidth: 42,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  disabled: { opacity: 0.55 },
});
