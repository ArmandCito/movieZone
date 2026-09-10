import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../services/tmdbService';
import { useUserData } from '../context/UserDataContext';
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

export default function MyBookingsScreen({ navigation }: any) {
  const { bookings, cancelBooking } = useUserData();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancel = (id: string) => {
    Alert.alert('Cancel booking?', 'This booking will be permanently removed.', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel Booking',
        style: 'destructive',
        onPress: () => cancelBooking(id),
      },
    ]);
  };

  if (bookings.length === 0) {
    return (
      <View style={styles.root}>
        <LiquidBackground />
        <SafeAreaView style={styles.container}>
          <GlassCard style={styles.header} radius={radii.md} intensity={25} padded={false}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.logo}>My Bookings</Text>
            <View style={{ width: 32 }} />
          </GlassCard>
          <View style={styles.emptyWrap}>
            <GlassCard style={styles.emptyCard} radius={radii.xl} intensity={40}>
              <Ionicons name="ticket-outline" size={52} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptyBody}>
                When you book a cinema seat, your tickets will appear here.
              </Text>
              <GlassButton
                label="Find a Movie"
                variant="primary"
                onPress={() => navigation.navigate('Home')}
                style={styles.browseBtn}
              />
            </GlassCard>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LiquidBackground />
      <SafeAreaView style={styles.container}>
        <GlassCard style={styles.header} radius={radii.md} intensity={25} padded={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.logo}>My Bookings</Text>
          <Text style={styles.count}>{bookings.length}</Text>
        </GlassCard>

        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <GlassCard style={styles.card} radius={radii.lg} intensity={30} padded={false}>
              <TouchableOpacity
                style={styles.cardTop}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MovieDetail', { movieId: item.movieId })}
              >
                <Image
                  source={
                    item.poster_path
                      ? { uri: getImageUrl(item.poster_path, 'w200') }
                      : { uri: 'https://via.placeholder.com/200x300/1A1A1A/FFFFFF?text=Movie' }
                  }
                  style={styles.poster}
                />
                <View style={styles.info}>
                  <Text style={styles.title} numberOfLines={1}>{item.movieTitle}</Text>
                  <Text style={styles.bookingId}>{item.id}</Text>
                  <View style={styles.metaLine}>
                    <Ionicons name="calendar" size={13} color={colors.textMuted} />
                    <Text style={styles.metaText}>{item.date}{item.weekday ? ` • ${item.weekday}` : ''} • {item.time}</Text>
                  </View>
                  <View style={styles.metaLine}>
                    <Ionicons name="location" size={13} color={colors.textMuted} />
                    <Text style={styles.metaText}>{item.location}</Text>
                  </View>
                  <View style={styles.metaLine}>
                    <Ionicons name="person" size={13} color={colors.textMuted} />
                    <Text style={styles.metaText}>Seats: {(item.seats || []).join(', ')}</Text>
                  </View>
                  <View style={styles.footerRow}>
                    <Text style={styles.price}>E{item.total || 0}.00</Text>
                    <Text style={styles.bookedAt}>Booked {formatDate(item.createdAt)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.cardActions}>
                <GlassButton
                  variant="danger"
                  style={styles.actionBtn}
                  onPress={() => handleCancel(item.id)}
                >
                  <View style={styles.actionBtnInner}>
                    <Ionicons name="close-circle" size={16} color={colors.textPrimary} />
                    <Text style={styles.actionText}>Cancel</Text>
                  </View>
                </GlassButton>
                <GlassButton
                  variant="glass"
                  style={styles.actionBtn}
                  onPress={() =>
                    navigation.navigate('MovieDetail', { movieId: item.movieId })
                  }
                >
                  <View style={styles.actionBtnInner}>
                    <Ionicons name="information-circle" size={16} color={colors.textPrimary} />
                    <Text style={styles.actionText}>Details</Text>
                  </View>
                </GlassButton>
              </View>
            </GlassCard>
          )}
        />
      </SafeAreaView>
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
    marginHorizontal: 16,
    marginTop: 8,
  },
  backBtn: { padding: 6 },
  logo: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  count: { color: colors.accent, fontSize: 15, fontWeight: '700', width: 32, textAlign: 'right', marginRight: 8 },
  listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  card: {
    marginBottom: 14,
  },
  cardTop: { flexDirection: 'row', padding: 12 },
  poster: { width: 74, height: 110, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  title: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  bookingId: { color: colors.accent, fontSize: 11, fontWeight: '700', marginTop: 3 },
  metaLine: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 4 },
  metaText: { color: colors.textSecondary, fontSize: 12, flex: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  bookedAt: { color: colors.textMuted, fontSize: 10 },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  actionBtn: { flex: 1 },
  actionBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  emptyCard: { width: '100%', alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 14 },
  emptyBody: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  browseBtn: { marginTop: 20, width: '100%' },
});
