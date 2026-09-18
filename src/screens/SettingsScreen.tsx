import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassIconButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

export default function SettingsScreen({ navigation }: any) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [recommendations, setRecommendations] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [downloadsWifi, setDownloadsWifi] = useState(true);
  const [language, setLanguage] = useState('English');
  const [videoQuality, setVideoQuality] = useState('Auto');

  const showComingSoon = (feature: string) =>
    Alert.alert(feature, 'This setting is coming soon in a future update.');

  const sectionTitle = (text: string) => <Text style={styles.sectionTitle}>{text}</Text>;

  const row = (
    icon: any,
    label: string,
    right?: React.ReactNode,
    onPress?: () => void,
    value?: string
  ) => (
    <TouchableOpacity
      key={label}
      style={styles.row}
      activeOpacity={onPress ? 0.6 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon} size={19} color={colors.accent} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {right || (value ? <Text style={styles.rowValue}>{value}</Text> : null)}
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <GlassIconButton icon="chevron-back" onPress={() => navigation.goBack()} style={styles.backBtn} />
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {sectionTitle('Playback')}
          <GlassCard style={styles.group} radius={radii.md} intensity={58} padded={false}>
            {row('notifications', 'Push Notifications', (
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: '#262626', true: '#E50914' }}
                thumbColor="#FFFFFF"
              />
            ))}
            {row('sparkles', 'Recommendations', (
              <Switch
                value={recommendations}
                onValueChange={setRecommendations}
                trackColor={{ false: '#262626', true: '#E50914' }}
                thumbColor="#FFFFFF"
              />
            ))}
            {row('play', 'Auto-play next episode', (
              <Switch
                value={autoPlay}
                onValueChange={setAutoPlay}
                trackColor={{ false: '#262626', true: '#E50914' }}
                thumbColor="#FFFFFF"
              />
            ))}
          </GlassCard>

          {sectionTitle('Streaming')}
          <GlassCard style={styles.group} radius={radii.md} intensity={58} padded={false}>
            {row('download', 'Download over Wi-Fi only', (
              <Switch
                value={downloadsWifi}
                onValueChange={setDownloadsWifi}
                trackColor={{ false: '#262626', true: '#E50914' }}
                thumbColor="#FFFFFF"
              />
            ))}
            {row('speedometer', 'Video Quality', undefined, () => showComingSoon('Video Quality'), videoQuality)}
            {row('language', 'Language', undefined, () => showComingSoon('Language'), language)}
          </GlassCard>

          {sectionTitle('Account')}
          <GlassCard style={styles.group} radius={radii.md} intensity={58} padded={false}>
            {row('person-circle', 'Edit Profile', undefined, () => navigation.navigate('Profile'))}
            {row('ticket', 'My Bookings', undefined, () => navigation.navigate('MyBookings'))}
            {row('heart', 'My Favorites', undefined, () => navigation.navigate('Favorites'))}
            {row('card', 'Payment Methods', undefined, () => showComingSoon('Payment Methods'))}
          </GlassCard>

          {sectionTitle('Support')}
          <GlassCard style={styles.group} radius={radii.md} intensity={58} padded={false}>
            {row('help-circle', 'Help Center', undefined, () => showComingSoon('Help Center'))}
            {row('chatbox', 'Contact Us', undefined, () => showComingSoon('Contact Us'))}
            {row('shield-checkmark', 'Privacy Policy', undefined, () => showComingSoon('Privacy Policy'))}
            {row('document-text', 'Terms of Service', undefined, () => showComingSoon('Terms of Service'))}
          </GlassCard>

          <Text style={styles.version}>MovieZone v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
      </LiquidBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgBottom },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { minWidth: 38, minHeight: 38 },
  headerTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  group: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.glassBorderSoft,
  },
  rowIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(229,9,20,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '500', flex: 1 },
  rowValue: { color: colors.textMuted, fontSize: 13, marginRight: 6 },
  version: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 28 },
});
