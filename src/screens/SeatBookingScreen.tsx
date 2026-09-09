import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '../context/UserDataContext';

export default function SeatBookingScreen({ navigation, route }: any) {
  const movie = route?.params?.movie || {};
  const date = route?.params?.date || 'Today';
  const weekday = route?.params?.weekday || '';
  const time = route?.params?.time || '';
  const location = route?.params?.location || 'Gables, Ezulwini';
  const glasses = route?.params?.glasses || 'No';
  const price = 50;

  const { addBooking } = useUserData();

  const makeSeats = () => {
    const seats: Record<string, boolean> = {
      B2: true, B3: true, C1: true, C5: true,
      D2: true, D7: true, E3: true, E4: true,
    };
    return seats;
  };
  const [booked] = useState<Record<string, boolean>>(makeSeats());
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSeat = (key: string) => {
    if (booked[key]) return;
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const total = selected.length * price;
  const seatLabel = selected.length ? `${selected.length} seat${selected.length > 1 ? 's' : ''}` : 'Seats';

  const confirmBooking = () => {
    if (selected.length === 0) return;
    const booking = {
      movieId: movie.id,
      movieTitle: movie.title,
      poster_path: movie.poster_path,
      date, weekday, time, location, glasses,
      seats: [...selected].sort(),
      total,
    };
    const newBooking = addBooking(booking);
    navigation.replace('BookingConfirmation', { booking: newBooking });
  };

  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{movie.title || ''}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={14} color="#E50914" />
            <Text style={styles.infoText}>{date} • {weekday} • {time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={14} color="#E50914" />
            <Text style={styles.infoText}>{location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cube" size={14} color="#E50914" />
            <Text style={styles.infoText}>3D Glasses: {glasses}</Text>
          </View>
        </View>

        <View style={styles.screenWrap}>
          <View style={styles.screen} />
          <Text style={styles.screenLabel}>SCREEN</Text>
        </View>

        <View style={styles.seatMap}>
          {rowLabels.map((rowLabel) => {
            const seatsInRow = [];
            for (let c = 1; c <= 8; c++) {
              const key = `${rowLabel}${c}`;
              seatsInRow.push(
                <TouchableOpacity
                  key={key}
                  disabled={!!booked[key]}
                  style={[
                    styles.seat,
                    booked[key] && styles.seatBooked,
                    selected.includes(key) && styles.seatSelected,
                  ]}
                  onPress={() => toggleSeat(key)}
                />
              );
            }
            return (
              <View style={styles.seatRow} key={rowLabel}>
                <Text style={styles.rowLabel}>{rowLabel}</Text>
                {seatsInRow}
              </View>
            );
          })}
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seat]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatSelected]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatBooked]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>{selected.length} seat(s) selected</Text>
          <Text style={styles.totalValue}>E{total}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, selected.length === 0 && styles.confirmBtnDisabled]}
          activeOpacity={0.8}
          onPress={confirmBooking}
          disabled={selected.length === 0}
        >
          <Ionicons name="ticket" size={18} color="#FFFFFF" />
          <Text style={styles.confirmText}>Confirm {seatLabel}</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 8,
  },
  backBtn: { padding: 6 },
  headerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', flex: 1, textAlign: 'center', marginHorizontal: 6 },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  infoCard: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14, marginBottom: 20, marginTop: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  infoText: { color: '#CCCCCC', fontSize: 13, marginLeft: 4 },
  screenWrap: { alignItems: 'center', marginBottom: 16 },
  screen: { width: '80%', height: 4, borderRadius: 2, backgroundColor: '#E50914', marginBottom: 6 },
  screenLabel: { color: '#8A8A8A', fontSize: 11, letterSpacing: 4 },
  seatMap: { marginBottom: 18, alignItems: 'center' },
  seatRow: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'center' },
  rowLabel: { color: '#8A8A8A', fontSize: 11, width: 14, textAlign: 'center' },
  seat: { width: 26, height: 26, borderRadius: 6, borderWidth: 1, borderColor: '#8A8A8A', backgroundColor: 'rgba(229,9,20,0.15)' },
  seatBooked: { backgroundColor: '#333333', borderColor: '#494949' },
  seatSelected: { backgroundColor: '#E50914', borderColor: '#FF4444' },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendBox: { width: 14, height: 14 },
  legendText: { color: '#8A8A8A', fontSize: 11 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  totalLabel: { color: '#AAAAAA', fontSize: 12 },
  totalValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E50914', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, marginLeft: 6 },
});