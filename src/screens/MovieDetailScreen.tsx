import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  getMovieDetails,
  getImageUrl,
  getBackdropUrl,
} from '../services/tmdbService';
import { useUserData } from '../context/UserDataContext';
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

export default function MovieDetailScreen({ navigation, route }: any) {
  const movieId = route?.params?.movieId;
  const { isFavorite, toggleFavorite } = useUserData();
  const [movie, setMovie] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedDate, setSelectedDate] = useState('d1');
  const [selectedTime, setSelectedTime] = useState('t1');
  const [showMore, setShowMore] = useState(false);
  const [location, setLocation] = useState('Gables, Ezulwini');
  const [glasses, setGlasses] = useState('No');
  const [locationModal, setLocationModal] = useState(false);
  const [glassesModal, setGlassesModal] = useState(false);

  useEffect(() => {
    if (movieId) {
      loadMovieDetails(movieId);
    }
  }, [movieId]);

  const loadMovieDetails = async (id: number) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getMovieDetails(id);
      setMovie(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load movie details');
    } finally {
      setIsLoading(false);
    }
  };

  const dates = [
    { id: 'd1', day: 'Today', weekday: 'Friday' },
    { id: 'd2', day: 'Tomorrow', weekday: 'Saturday' },
    { id: 'd3', day: 'Sun', weekday: 'Sunday' },
  ];

  const locations = ['Gables, Ezulwini', 'Manzini City Mall', 'Mbabane Cinema'];
  const glassesOptions = ['No', 'Yes'];
  const times = [
    { id: 't1', time: '11:15', seats: 4 },
    { id: 't2', time: '14:15', seats: 10 },
    { id: 't3', time: '17:15', seats: 15 },
    { id: 't4', time: '20:15', seats: 8 },
  ];

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'TBA';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatReleaseDate = (date: string) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRating = (vote: number) => (vote / 2).toFixed(1);

  const getDirector = () => {
    const director = movie?.credits?.crew.find((c: any) => c.job === 'Director');
    return director?.name || 'Unknown';
  };

  const getCast = () => {
    return movie?.credits?.cast.slice(0, 5).map((c: any) => c.name).join(', ') || 'Unknown';
  };

  const synopsis = movie?.overview || 'No synopsis available.';
  const shortSynopsis = synopsis.length > 140 ? synopsis.slice(0, 140) + '...' : synopsis;

  if (isLoading) {
    return (
      <View style={styles.root}>
        <LiquidBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading movie details...</Text>
          </View>
        </SafeAreaView>
        </LiquidBackground>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.root}>
        <LiquidBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
            <GlassCard style={styles.backButton} padded={false} radius={radii.pill} intensity={58}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </GlassCard>
          </View>
        </SafeAreaView>
        </LiquidBackground>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Image
              source={{ uri: getBackdropUrl(movie.backdrop_path) }}
              style={styles.banner}
            />
            <GlassCard style={styles.backButton} padded={false} radius={radii.pill} intensity={58}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </GlassCard>
            {movie && (
              <GlassCard style={styles.favoriteButton} padded={false} radius={radii.pill} intensity={58}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() =>
                    toggleFavorite({
                      id: movie.id,
                      title: movie.title,
                      poster_path: movie.poster_path,
                      backdrop_path: movie.backdrop_path,
                      vote_average: movie.vote_average,
                      release_date: movie.release_date,
                    })
                  }
                >
                  <Ionicons
                    name={isFavorite(movie.id) ? 'heart' : 'heart-outline'}
                    size={22}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
              </GlassCard>
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{movie.title}</Text>

            <View style={styles.metaRow}>
              <GlassCard style={styles.ratingBadge} radius={radii.sm} intensity={55} padded={false}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>{getRating(movie.vote_average)}</Text>
              </GlassCard>
              <Text style={styles.metaText}>{formatReleaseDate(movie.release_date)}</Text>
              <Text style={styles.metaText}>{formatRuntime(movie.runtime)}</Text>
              {movie.genres?.slice(0, 2).map((g: any) => (
                <Text key={g.id} style={styles.metaText}>{g.name}</Text>
              ))}
            </View>

            <Text style={styles.synopsis}>
              {showMore ? synopsis : shortSynopsis}{' '}
              <Text
                style={styles.readMore}
                onPress={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show Less' : 'Read More'}
              </Text>
            </Text>

            <GlassButton
              variant="primary"
              style={styles.watchOnlineButton}
              onPress={() =>
                navigation.navigate('Player', {
                  movieId: movie.id,
                  title: movie.title,
                  poster: movie.poster_path,
                  backdrop: movie.backdrop_path,
                  voteAverage: movie.vote_average,
                })
              }
            >
              <View style={styles.watchOnlineContent}>
                <Ionicons name="play-circle" size={20} color={colors.textPrimary} />
                <Text style={styles.watchOnlineText}>Watch Online</Text>
              </View>
            </GlassButton>

            <GlassCard style={styles.infoRow} radius={radii.lg} intensity={62}>
              <Image
                source={{ uri: getImageUrl(movie.poster_path) }}
                style={styles.infoPoster}
              />
              <View style={styles.infoText}>
                <Text style={styles.infoLine}>
                  <Text style={styles.infoLabel}>Director: </Text>
                  {getDirector()}
                </Text>
                <Text style={styles.infoLine}>
                  <Text style={styles.infoLabel}>Cast: </Text>
                  {getCast()}
                </Text>
                <Text style={styles.infoLine}>
                  <Text style={styles.infoLabel}>Release Date: </Text>
                  {formatReleaseDate(movie.release_date)}
                </Text>
                <Text style={[styles.infoLine, styles.priceLine]}>
                  Ticket Price: E50.00
                </Text>
              </View>
            </GlassCard>

            <Text style={styles.sectionTitle}>Viewing Schedule</Text>
            <View style={styles.dateRow}>
              {dates.map((d: any) => (
                <GlassCard
                  key={d.id}
                  style={[styles.dateCard, selectedDate === d.id && styles.dateCardActive]}
                  radius={radii.md}
                  intensity={56}
                  tintColor={selectedDate === d.id ? colors.accentSoft : colors.glassFill}
                  padded={false}
                >
                  <TouchableOpacity
                    style={styles.dateCardInner}
                    onPress={() => setSelectedDate(d.id)}
                  >
                    <Text style={styles.dateDay}>{d.day}</Text>
                    <Text style={styles.dateWeekday}>{d.weekday}</Text>
                  </TouchableOpacity>
                </GlassCard>
              ))}
            </View>

            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => setLocationModal(true)}
            >
              <Text style={styles.dropdownLabel}>Location:</Text>
              <View style={styles.dropdownValueRow}>
                <Text style={styles.dropdownValue}>{location}</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => setGlassesModal(true)}
            >
              <Text style={styles.dropdownLabel}>3d Glasses:</Text>
              <View style={styles.dropdownValueRow}>
                <Text style={styles.dropdownValue}>{glasses}</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Viewing Times</Text>
            <View style={styles.timesRow}>
              {times.map((t: any) => (
                <GlassCard
                  key={t.id}
                  style={[styles.timeCard, selectedTime === t.id && styles.timeCardActive]}
                  radius={radii.md}
                  intensity={56}
                  tintColor={selectedTime === t.id ? colors.accentSoft : colors.glassFill}
                  padded={false}
                >
                  <TouchableOpacity
                    style={styles.timeCardInner}
                    onPress={() => setSelectedTime(t.id)}
                  >
                    <Text style={styles.timeText}>{t.time}</Text>
                    <Text style={styles.seatsText}>{t.seats} seats available</Text>
                  </TouchableOpacity>
                </GlassCard>
              ))}
            </View>

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        <GlassCard style={styles.bookBar} radius={radii.lg} intensity={68}>
          <GlassButton
            label="Book A Seat"
            variant="primary"
            onPress={() =>
              navigation.navigate('SeatPicker', {
                movie: {
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                },
                date: dates.find((d: any) => d.id === selectedDate)?.day || 'Today',
                weekday: dates.find((d: any) => d.id === selectedDate)?.weekday || '',
                time: times.find((t: any) => t.id === selectedTime)?.time || '',
                location,
                glasses,
              })
            }
          />
        </GlassCard>

        {/* Location Modal */}
        <Modal visible={locationModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setLocationModal(false)}
          >
            <GlassCard style={styles.modalContent} radius={radii.lg} intensity={72} padded={false}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <FlatList
                data={locations}
                keyExtractor={(item: any) => item}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setLocation(item);
                      setLocationModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </GlassCard>
          </TouchableOpacity>
        </Modal>

        {/* Glasses Modal */}
        <Modal visible={glassesModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setGlassesModal(false)}
          >
            <GlassCard style={styles.modalContent} radius={radii.lg} intensity={72} padded={false}>
              <Text style={styles.modalTitle}>3D Glasses</Text>
              <FlatList
                data={glassesOptions}
                keyExtractor={(item: any) => item}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setGlasses(item);
                      setGlassesModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </GlassCard>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
      </LiquidBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBottom,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  banner: {
    width: '100%',
    height: 320,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  iconButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: 11,
    marginLeft: 3,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginRight: 10,
  },
  synopsis: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  readMore: {
    color: colors.accent,
    fontWeight: '600',
  },
  watchOnlineButton: {
    marginBottom: 20,
  },
  watchOnlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchOnlineText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoPoster: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 14,
  },
  infoText: {
    flex: 1,
    justifyContent: 'space-between',
  },
  infoLine: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 17,
  },
  infoLabel: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  priceLine: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 14,
    marginTop: 8,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateCard: {
    marginRight: 12,
  },
  dateCardInner: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dateCardActive: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  dateDay: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  dateWeekday: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorderSoft,
  },
  dropdownLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  dropdownValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownValue: {
    color: colors.textPrimary,
    fontSize: 14,
    marginRight: 6,
    textDecorationLine: 'underline',
  },
  timesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeCard: {
    marginRight: 12,
    marginBottom: 12,
  },
  timeCardInner: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  timeCardActive: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  timeText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  seatsText: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  bookBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorderSoft,
  },
  modalItemText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
