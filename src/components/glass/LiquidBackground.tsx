import React, { useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView, BlurTargetView } from 'expo-blur';
import { colors } from '../../theme/glass';
import BlurTargetContext from './BlurTargetContext';

type LiquidBackgroundProps = {
  children?: React.ReactNode;
};

/**
 * Ambient "liquid glass" backdrop: a dark gradient base with soft, blurred
 * color blobs floating behind it. Wrap a screen's real content in this
 * component (instead of rendering it as a bare sibling) — it publishes a
 * blur target ref through context so every GlassSurface/GlassCard rendered
 * inside picks up real Android blur automatically, in addition to the
 * always-automatic native blur on iOS.
 */
export default function LiquidBackground({ children }: LiquidBackgroundProps) {
  const targetRef = useRef<View>(null);
  const androidBlurMethod = Platform.OS === 'android' ? 'dimezisBlurViewSdk31Plus' : undefined;

  return (
    <BlurTargetContext.Provider value={targetRef}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BlurTargetView ref={targetRef} style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={[colors.bgTop, colors.bgMid, colors.bgBottom]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.blob, styles.blobRed]} />
          <View style={[styles.blob, styles.blobPurple]} />
          <View style={[styles.blob, styles.blobBlue]} />
        </BlurTargetView>
        <BlurView
          intensity={90}
          tint="dark"
          blurMethod={androidBlurMethod}
          blurTarget={targetRef}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </BlurTargetContext.Provider>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobRed: {
    width: 320,
    height: 320,
    top: -60,
    right: -90,
    backgroundColor: colors.blobRed,
  },
  blobPurple: {
    width: 280,
    height: 280,
    top: '35%',
    left: -110,
    backgroundColor: colors.blobPurple,
  },
  blobBlue: {
    width: 300,
    height: 300,
    bottom: -100,
    right: -80,
    backgroundColor: colors.blobBlue,
  },
});
