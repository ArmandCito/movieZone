import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../services/tmdbService';
import { useUserData } from '../context/UserDataContext';
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

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
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.checkRow}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={34} color={colors.textPrimary} />
            </View>
          </View>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>
            A confirmation has been sent to your account.
          </Text>

          <GlassCard style={styles.ticketCard} radius={radii.xl} intensity={72}>
            <View style={styles.ticketHeader}>
              <View style={styles.posterWrap}>
                {booking.poster_path ? (
                  <View style={styles.posterPlaceholder} />
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
          </GlassCard>

          <Text style={styles.note}>
            Present this ticket at the cinema entrance. Cancel anytime from My Bookings.
          </Text>

          <GlassButton variant="primary" onPress={handleDone} style={styles.doneBtn}>
            <View style={styles.doneBtnInner}>
              <Ionicons name="ticket" size={18} color={colors.textPrimary} />
              <Text style={styles.doneText}>View My Bookings</Text>
            </View>
          </GlassButton>
          <GlassButton
            label="Cancel This Booking"
            variant="danger"
            onPress={handleCancel}
            style={styles.cancelBtn}
          />
        </ScrollView>
      </SafeAreaView>
      </LiquidBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgBottom },
  container: { flex: 1 },
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
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginBottom: 24 },
  ticketCard: {
    width: '100%',
    marginBottom: 20,
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'flex-start' },
  posterWrap: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  posterPlaceholder: {
    width: 70,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.glassFillStrong,
  },
  movieTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800', flex: 1 },
  bookingId: { color: colors.textMuted, fontSize: 12 },
  divider: { height: 1, backgroundColor: colors.glassBorderSoft, marginVertical: 12 },
  row: { flexDirection: 'row', marginBottom: 14 },
  rowItem: { flex: 1 },
  rowLabel: { color: colors.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  rowValue: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  rowPrice: { color: colors.accent, fontSize: 15, fontWeight: '800' },
  barcodeRow: { alignItems: 'center' },
  barcode: { color: colors.textSecondary, fontSize: 22, letterSpacing: 2, fontWeight: '800' },
  note: { color: colors.textSecondary, fontSize: 12, textAlign: 'center', lineHeight: 18, marginBottom: 24 },
  doneBtn: {
    width: '100%',
  },
  doneBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: { color: colors.textPrimary, fontWeight: '700', fontSize: 15, marginLeft: 8 },
  cancelBtn: { marginTop: 14, width: '100%' },
});
