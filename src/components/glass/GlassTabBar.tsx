import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassView, GlassContainer, isLiquidGlassAvailable } from 'expo-glass-effect';
import GlassCard from './GlassCard';
import { colors, radii } from '../../theme/glass';

export type TabKey = 'Home' | 'Watch' | 'Search' | 'Profile';

const TABS: { key: TabKey; icon: keyof typeof Ionicons.glyphMap; size: number }[] = [
  { key: 'Home', icon: 'home', size: 24 },
  { key: 'Watch', icon: 'play-circle', size: 26 },
  { key: 'Search', icon: 'search', size: 24 },
  { key: 'Profile', icon: 'person', size: 24 },
];

const BAR_HEIGHT = 64;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH - 40;
const ITEM_WIDTH = BAR_WIDTH / TABS.length;

// iOS 26+ only; everywhere else expo-glass-effect's own GlassView would just
// render a plain View, so we swap to our blurred fallback bar ourselves.
const LIQUID_GLASS_SUPPORTED = isLiquidGlassAvailable();

type GlassTabBarProps = {
  active: TabKey;
  navigation: any;
};

export default function GlassTabBar({ active, navigation }: GlassTabBarProps) {
  return LIQUID_GLASS_SUPPORTED ? (
    <NativeLiquidTabBar active={active} navigation={navigation} />
  ) : (
    <FallbackGlassTabBar active={active} navigation={navigation} />
  );
}

/** Real iOS 26 Liquid Glass: native specular highlight + touch response, no manual animation needed. */
function NativeLiquidTabBar({ active, navigation }: GlassTabBarProps) {
  return (
    <GlassContainer spacing={2} style={styles.nativeBar}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <GlassView
            key={tab.key}
            isInteractive
            glassEffectStyle={isActive ? 'regular' : 'clear'}
            tintColor={isActive ? colors.accent : undefined}
            style={styles.nativeItem}
          >
            <TouchableOpacity
              style={styles.nativeTouchable}
              activeOpacity={0.75}
              disabled={isActive}
              onPress={() => navigation.navigate(tab.key)}
            >
              <Ionicons
                name={tab.icon}
                size={tab.size}
                color={isActive ? colors.textPrimary : colors.textMuted}
              />
            </TouchableOpacity>
          </GlassView>
        );
      })}
    </GlassContainer>
  );
}

/** Android / pre-26 iOS fallback: blurred glass bar with an animated sliding pill + press bounce. */
function FallbackGlassTabBar({ active, navigation }: GlassTabBarProps) {
  const activeIndex = Math.max(TABS.findIndex((t) => t.key === active), 0);
  const indicatorX = useRef(new Animated.Value(activeIndex)).current;
  const scales = useRef(TABS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: activeIndex,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [activeIndex, indicatorX]);

  const pressIn = (i: number) =>
    Animated.spring(scales[i], { toValue: 0.82, useNativeDriver: true, friction: 6 }).start();
  const pressOut = (i: number) =>
    Animated.spring(scales[i], { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }).start();

  return (
    <GlassCard style={styles.fallbackBar} radius={radii.xl} intensity={65} padded={false}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            transform: [
              {
                translateX: indicatorX.interpolate({
                  inputRange: TABS.map((_, i) => i),
                  outputRange: TABS.map((_, i) => i * ITEM_WIDTH),
                }),
              },
            ],
          },
        ]}
      />
      {TABS.map((tab, i) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.fallbackItem}
            activeOpacity={0.85}
            disabled={isActive}
            onPressIn={() => pressIn(i)}
            onPressOut={() => pressOut(i)}
            onPress={() => navigation.navigate(tab.key)}
          >
            <Animated.View style={{ transform: [{ scale: scales[i] }] }}>
              <Ionicons name={tab.icon} size={tab.size} color={isActive ? colors.accent : colors.textMuted} />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  nativeBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    height: BAR_HEIGHT,
    borderRadius: radii.xl,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  nativeItem: {
    flex: 1,
    height: '100%',
  },
  nativeTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    height: BAR_HEIGHT,
    flexDirection: 'row',
  },
  fallbackItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: (ITEM_WIDTH - (ITEM_WIDTH - 16)) / 2,
    width: ITEM_WIDTH - 16,
    borderRadius: radii.lg,
    backgroundColor: colors.glassFillStrong,
    borderWidth: 1,
    borderColor: colors.glassHighlight,
  },
});
