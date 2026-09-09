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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.logo}>My Bookings</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.emptyWrap}>
          <Ionicons name="ticket-outline" size={52} color="#555555" />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyBody}>
            When you book a cinema seat, your tickets will appear here.
          </Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.browseText}>Find a Movie</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.logo}>My Bookings</Text>
        <Text style={styles.count}>{bookings.length}</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
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
                  <Ionicons name="calendar" size={13} color="#8A8A8A" />
                  <Text style={styles.metaText}>{item.date}{item.weekday ? ` • ${item.weekday}` : ''} • {item.time}</Text>
                </View>
                <View style={styles.metaLine}>
                  <Ionicons name="location" size={13} color="#8A8A8A" />
                  <Text style={styles.metaText}>{item.location}</Text>
                </View>
                <View style={styles.metaLine}>
                  <Ionicons name="person" size={13} color="#8A8A8A" />
                  <Text style={styles.metaText}>Seats: {(item.seats || []).join(', ')}</Text>
                </View>
                <View style={styles.footerRow}>
                  <Text style={styles.price}>E{item.total || 0}.00</Text>
                  <Text style={styles.bookedAt}>Booked {formatDate(item.createdAt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleCancel(item.id)}>
                <Ionicons name="close-circle" size={16} color="#E50914" />
                <Text style={styles.actionCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  navigation.navigate('MovieDetail', { movieId: item.movieId })
                }
              >
                <Ionicons name="information-circle" size={16} color="#CCCCCC" />
                <Text style={styles.actionInfoText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { padding: 6 },
  logo: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  count: { color: '#E50914', fontSize: 15, fontWeight: '700', width: 32, textAlign: 'right', marginRight: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardTop: { flexDirection: 'row', padding: 12 },
  poster: { width: 74, height: 110, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  bookingId: { color: '#E50914', fontSize: 11, fontWeight: '700', marginTop: 3 },
  metaLine: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 4 },
  metaText: { color: '#AAAAAA', fontSize: 12, flex: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  bookedAt: { color: '#666666', fontSize: 10 },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 5,
  },
  actionCancelText: { color: '#E50914', fontSize: 13, fontWeight: '600' },
  actionInfoText: { color: '#CCCCCC', fontSize: 13, fontWeight: '600' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 36 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 14 },
  emptyBody: { color: '#8A8A8A', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  browseBtn: { backgroundColor: '#E50914', borderRadius: 10, paddingHorizontal: 26, paddingVertical: 12, marginTop: 20 },
  browseText: { color: '#FFFFFF', fontWeight: '700' },
});