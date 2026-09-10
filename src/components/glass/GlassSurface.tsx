import React from 'react';
import { Platform, StyleSheet, View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radii, glassShadow } from '../../theme/glass';
import { useBlurTarget } from './BlurTargetContext';

type GlassSurfaceProps = ViewProps & {
  /** Blur strength passed straight to expo-blur. */
  intensity?: number;
  /** Extra tint on top of the blur to bias the glass color. */
  tintColor?: string;
  radius?: number;
  bordered?: boolean;
  /** Adds the standard elevation/shadow used to lift glass off the background. */
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * The base "liquid glass" panel: a blurred, translucent, thin-bordered surface.
 * Use this (or GlassCard/GlassButton) instead of flat StyleSheet backgrounds
 * for any card, header, bottom bar, modal, badge or input container.
 */
export default function GlassSurface({
  intensity = 65,
  tintColor = colors.glassFill,
  radius = radii.md,
  bordered = true,
  elevated = true,
  style,
  children,
  ...rest
}: GlassSurfaceProps) {
  const blurTarget = useBlurTarget();

  return (
    <View
      style={[
        { borderRadius: radius, overflow: 'hidden' },
        elevated && glassShadow,
        style,
      ]}
      {...rest}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        blurMethod={Platform.OS === 'android' && blurTarget ? 'dimezisBlurViewSdk31Plus' : undefined}
        blurTarget={blurTarget ?? undefined}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: tintColor },
          bordered && {
            borderWidth: 1,
            borderColor: colors.glassBorder,
            borderRadius: radius,
          },
        ]}
      />
      {children}
    </View>
  );
}
