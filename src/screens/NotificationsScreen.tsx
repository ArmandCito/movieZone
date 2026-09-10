import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

interface NotificationItem {
  id: string;
  type: 'booking' | 'release' | 'promo' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'release',
    title: 'New releases added',
    body: 'Exciting new premieres are now playing in cinemas near you.',
    time: '2h ago',
    read: false,
  },
  {
    id: '2',
    type: 'promo',
    title: 'Welcome reward',
    body: 'Enjoy E50 off your next cinema booking this weekend only.',
    time: '1d ago',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Streaming is here',
    body: 'Browse hundreds of titles now available to watch online.',
    time: '3d ago',
    read: true,
  },
  {
    id: '4',
    type: 'booking',
    title: 'Booking tips',
    body: 'Arrive 20 minutes early with your ticket barcode ready to scan.',
    time: '1w ago',
    read: true,
  },
];

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const typeIcon: Record<NotificationItem['type'], any> = {
    booking: 'ticket',
    release: 'film',
    promo: 'pricetag',
    system: 'megaphone',
  };

  return (
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container}>
        <GlassCard style={styles.header} radius={radii.lg} intensity={58} padded={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.logo}>Notifications</Text>
          {unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={styles.markAll}>Mark all read</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 32 }} />
          )}
        </GlassCard>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            unreadCount > 0 ? (
              <Text style={styles.sectionLabel}>New • {unreadCount}</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <GlassCard
              style={[styles.card, item.read && styles.cardRead]}
              radius={radii.lg}
              intensity={58}
              tintColor={item.read ? colors.glassFillSubtle : colors.glassFill}
              padded={false}
            >
              <TouchableOpacity style={styles.cardTouch} activeOpacity={0.7}>
                <View style={[styles.iconWrap, item.read && styles.iconWrapRead]}>
                  <Ionicons name={typeIcon[item.type]} size={20} color={item.read ? colors.textMuted : colors.accent} />
                </View>
                <View style={styles.info}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, item.read && styles.titleRead]}>{item.title}</Text>
                    {!item.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            </GlassCard>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="notifications-off-outline" size={52} color={colors.textMuted} />
              <Text style={styles.emptyText}>You're all caught up</Text>
            </View>
          }
        />
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
    marginHorizontal: 12,
    marginTop: 8,
  },
  backBtn: { padding: 6 },
  logo: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  markAll: { color: colors.accent, fontSize: 13, fontWeight: '600', marginRight: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '700', marginTop: 16, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  card: {
    marginBottom: 10,
  },
  cardTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  cardRead: { opacity: 0.72 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconWrapRead: { backgroundColor: colors.glassFillSubtle },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.textPrimary, fontSize: 15, fontWeight: '600', flex: 1 },
  titleRead: { color: colors.textMuted },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginLeft: 8 },
  body: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginTop: 3 },
  time: { color: colors.textMuted, fontSize: 11, marginTop: 5 },
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: colors.textMuted, fontSize: 15, fontWeight: '600', marginTop: 12 },
});
