import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import GlassSurface from './GlassSurface';
import { colors, radii } from '../../theme/glass';

type GlassCardProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  padded?: boolean;
  radius?: number;
  intensity?: number;
  tintColor?: string;
};

/** Padded glass panel for content cards, list rows, form sections, modals. */
export default function GlassCard({
  style,
  children,
  padded = true,
  radius = radii.lg,
  intensity = 60,
  tintColor = colors.glassFill,
}: GlassCardProps) {
  return (
    <GlassSurface
      radius={radius}
      intensity={intensity}
      tintColor={tintColor}
      style={[padded && { padding: 16 }, style]}
    >
      {children}
    </GlassSurface>
  );
}
