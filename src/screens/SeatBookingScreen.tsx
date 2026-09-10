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
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

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
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <GlassCard style={styles.backBtn} padded={false} radius={radii.pill} intensity={58}>
            <TouchableOpacity style={styles.backBtnTouch} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </GlassCard>
          <Text style={styles.headerTitle} numberOfLines={1}>{movie.title || ''}</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.infoCard} radius={radii.md} intensity={62}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={14} color={colors.accent} />
              <Text style={styles.infoText}>{date} • {weekday} • {time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={14} color={colors.accent} />
              <Text style={styles.infoText}>{location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cube" size={14} color={colors.accent} />
              <Text style={styles.infoText}>3D Glasses: {glasses}</Text>
            </View>
          </GlassCard>

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

          <GlassCard style={styles.legendRow} radius={radii.md} intensity={56}>
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
          </GlassCard>
        </ScrollView>

        <GlassCard style={styles.bottomBar} radius={radii.lg} intensity={68}>
          <View>
            <Text style={styles.totalLabel}>{selected.length} seat(s) selected</Text>
            <Text style={styles.totalValue}>E{total}</Text>
          </View>
          <GlassButton
            variant="primary"
            disabled={selected.length === 0}
            onPress={confirmBooking}
            style={styles.confirmBtn}
          >
            <View style={styles.confirmContent}>
              <Ionicons name="ticket" size={18} color={colors.textPrimary} />
              <Text style={styles.confirmText}>Confirm {seatLabel}</Text>
            </View>
          </GlassButton>
        </GlassCard>
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
    paddingVertical: 8,
  },
  backBtn: {},
  backBtnTouch: { padding: 6, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '600', flex: 1, textAlign: 'center', marginHorizontal: 6 },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  infoCard: { marginBottom: 20, marginTop: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  infoText: { color: colors.textSecondary, fontSize: 13, marginLeft: 4 },
  screenWrap: { alignItems: 'center', marginBottom: 16 },
  screen: { width: '80%', height: 4, borderRadius: 2, backgroundColor: colors.accent, marginBottom: 6 },
  screenLabel: { color: colors.textMuted, fontSize: 11, letterSpacing: 4 },
  seatMap: { marginBottom: 18, alignItems: 'center' },
  seatRow: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'center' },
  rowLabel: { color: colors.textMuted, fontSize: 11, width: 14, textAlign: 'center' },
  seat: { width: 26, height: 26, borderRadius: 6, borderWidth: 1, borderColor: colors.textMuted, backgroundColor: 'rgba(229,9,20,0.15)' },
  seatBooked: { backgroundColor: colors.glassFillStrong, borderColor: colors.glassBorderSoft },
  seatSelected: { backgroundColor: colors.accent, borderColor: colors.danger },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendBox: { width: 14, height: 14 },
  legendText: { color: colors.textMuted, fontSize: 11 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  totalLabel: { color: colors.textSecondary, fontSize: 12 },
  totalValue: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  confirmBtn: { paddingHorizontal: 4 },
  confirmContent: { flexDirection: 'row', alignItems: 'center' },
  confirmText: { color: colors.textPrimary, fontWeight: '700', fontSize: 14, marginLeft: 6 },
});
