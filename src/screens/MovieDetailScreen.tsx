import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getMovieDetails,
  getImageUrl,
  getBackdropUrl,
} from '../services/tmdbService';

export default function MovieDetailScreen({ navigation, route }: any) {
  const movieId = route?.params?.movieId;
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
  const [favorite, setFavorite] = useState(false);

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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.loadingText}>Loading movie details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={{ uri: getBackdropUrl(movie.backdrop_path) }}
            style={styles.banner}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setFavorite(!favorite)}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{getRating(movie.vote_average)}</Text>
            </View>
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

          <View style={styles.infoRow}>
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
          </View>

          <Text style={styles.sectionTitle}>Viewing Schedule</Text>
          <View style={styles.dateRow}>
            {dates.map((d: any) => (
              <TouchableOpacity
                key={d.id}
                style={[
                  styles.dateCard,
                  selectedDate === d.id && styles.dateCardActive,
                ]}
                onPress={() => setSelectedDate(d.id)}
              >
                <Text
                  style={[
                    styles.dateDay,
                    selectedDate === d.id && styles.dateTextActive,
                  ]}
                >
                  {d.day}
                </Text>
                <Text
                  style={[
                    styles.dateWeekday,
                    selectedDate === d.id && styles.dateTextActive,
                  ]}
                >
                  {d.weekday}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.dropdownRow}
            onPress={() => setLocationModal(true)}
          >
            <Text style={styles.dropdownLabel}>Location:</Text>
            <View style={styles.dropdownValueRow}>
              <Text style={styles.dropdownValue}>{location}</Text>
              <Ionicons name="chevron-down" size={16} color="#AAAAAA" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownRow}
            onPress={() => setGlassesModal(true)}
          >
            <Text style={styles.dropdownLabel}>3d Glasses:</Text>
            <View style={styles.dropdownValueRow}>
              <Text style={styles.dropdownValue}>{glasses}</Text>
              <Ionicons name="chevron-down" size={16} color="#AAAAAA" />
            </View>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Viewing Times</Text>
          <View style={styles.timesRow}>
            {times.map((t: any) => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.timeCard,
                  selectedTime === t.id && styles.timeCardActive,
                ]}
                onPress={() => setSelectedTime(t.id)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === t.id && styles.dateTextActive,
                  ]}
                >
                  {t.time}
                </Text>
                <Text
                  style={[
                    styles.seatsText,
                    selectedTime === t.id && styles.dateTextActive,
                  ]}
                >
                  {t.seats} seats available
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.bookBar}>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book A Seat</Text>
        </TouchableOpacity>
      </View>

      {/* Location Modal */}
      <Modal visible={locationModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLocationModal(false)}
        >
          <View style={styles.modalContent}>
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
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Glasses Modal */}
      <Modal visible={glassesModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setGlassesModal(false)}
        >
          <View style={styles.modalContent}>
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
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8A8A8A',
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
    color: '#E50914',
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    backgroundColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginLeft: 3,
  },
  metaText: {
    color: '#CCCCCC',
    fontSize: 12,
    marginRight: 10,
  },
  synopsis: {
    color: '#CCCCCC',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  readMore: {
    color: '#E50914',
    fontWeight: '600',
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
    color: '#CCCCCC',
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 17,
  },
  infoLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  priceLine: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 14,
    marginTop: 8,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateCard: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  dateCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  dateDay: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  dateWeekday: {
    color: '#8A8A8A',
    fontSize: 11,
    marginTop: 2,
  },
  dateTextActive: {
    color: '#121212',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  dropdownLabel: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  dropdownValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownValue: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 6,
    textDecorationLine: 'underline',
  },
  timesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeCard: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  timeCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  timeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  seatsText: {
    color: '#8A8A8A',
    fontSize: 10,
    marginTop: 2,
  },
  bookBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  bookButton: {
    backgroundColor: '#E50914',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  modalItemText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
});