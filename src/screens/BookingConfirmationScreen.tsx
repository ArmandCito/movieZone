import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../services/tmdbService';
import { useUserData } from '../context/UserDataContext';

export default function BookingConfirmationScreen({ navigation, route }: any) {
  const booking = route?.params?.booking || {};
  const { cancelBooking } = useUserData();

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MyBookings' }],
    });
  };

  const handleCancel = () => {
    if (booking.id) cancelBooking(booking.id);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.checkRow}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={34} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          A confirmation has been sent to your account.
        </Text>

        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View style={styles.posterWrap}>
              {booking.poster_path ? (
                <View
                  style={{
                    width: 70,
                    height: 100,
                    borderRadius: 8,
                    backgroundColor: '#262626',
                  }}
                />
              ) : null}
              <Text style={styles.movieTitle} numberOfLines={2}>
                {booking.movieTitle || 'Movie'}
              </Text>
            </View>
            <Text style={styles.bookingId}>{booking.id}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>CINEMA</Text>
              <Text style={styles.rowValue}>{booking.location || 'Gables, Ezulwini'}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>DATE</Text>
              <Text style={styles.rowValue}>{booking.date} • {booking.weekday}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>TIME</Text>
              <Text style={styles.rowValue}>{booking.time}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>SEATS</Text>
              <Text style={styles.rowValue}>{(booking.seats || []).join(', ')}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>SCREEN</Text>
              <Text style={styles.rowValue}>Standard</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>3D GLASSES</Text>
              <Text style={styles.rowValue}>{booking.glasses || 'No'}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>TOTAL</Text>
              <Text style={styles.rowPrice}>E{booking.total || 0}.00</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.barcodeRow}>
            <Text style={styles.barcode}>|| ||| || ||||| || |||| || ||</Text>
          </View>
        </View>

        <Text style={styles.note}>
          Present this ticket at the cinema entrance. Cancel anytime from My Bookings.
        </Text>

        <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
          <Ionicons name="ticket" size={18} color="#FFFFFF" />
          <Text style={styles.doneText}>View My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel This Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40, alignItems: 'center' },
  checkRow: { marginBottom: 14 },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#8A8A8A', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  ticketCard: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'flex-start' },
  posterWrap: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  movieTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', flex: 1 },
  bookingId: { color: '#8A8A8A', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#262626', marginVertical: 12 },
  row: { flexDirection: 'row', marginBottom: 14 },
  rowItem: { flex: 1 },
  rowLabel: { color: '#8A8A8A', fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  rowValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  rowPrice: { color: '#E50914', fontSize: 15, fontWeight: '800' },
  barcodeRow: { alignItems: 'center' },
  barcode: { color: '#CCCCCC', fontSize: 22, letterSpacing: 2, fontWeight: '800' },
  note: { color: '#AAAAAA', fontSize: 12, textAlign: 'center', lineHeight: 18, marginBottom: 24 },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
  },
  doneText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  cancelBtn: { marginTop: 14 },
  cancelText: { color: '#E50914', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
});