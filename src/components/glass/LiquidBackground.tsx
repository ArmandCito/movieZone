import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/glass';

/**
 * Ambient "liquid glass" backdrop: a dark gradient base with soft, blurred
 * color blobs floating behind it. Render this as the very first child of a
 * screen's root container (the container needs position: 'relative') and
 * keep all real content above it — every glass surface in front of it will
 * pick up its color through the blur.
 */
export default function LiquidBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[colors.bgTop, colors.bgMid, colors.bgBottom]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blob, styles.blobRed]} />
      <View style={[styles.blob, styles.blobPurple]} />
      <View style={[styles.blob, styles.blobBlue]} />
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
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
