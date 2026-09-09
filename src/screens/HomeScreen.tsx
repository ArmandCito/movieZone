import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  getTrendingMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getImageUrl,
  getBackdropUrl,
} from '../services/tmdbService';
import { useUserData } from '../context/UserDataContext';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

export default function HomeScreen({ navigation }: any) {
  const { continueWatching } = useUserData();
  const [activeBanner, setActiveBanner] = useState(0);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [trending, setTrending] = useState<any[]>([]);
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setIsLoading(true);
    setError('');
    try {
      const trendingData = await getTrendingMovies('week');
      const nowPlayingData = await getNowPlayingMovies();
      const upcomingData = await getUpcomingMovies();
      setTrending(trendingData.results);
      setNowPlaying(nowPlayingData.results);
      setUpcoming(upcomingData.results);
    } catch (err: any) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setIsLoading(false);
    }
  };

  const onBannerScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setActiveBanner(index);
  };

  const years = ['All', '2024', '2023', '2022'];
  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredUpcoming = upcoming.filter((movie) => {
    const releaseDate = new Date(movie.release_date);
    const yearMatch = selectedYear === 'All' || String(releaseDate.getFullYear()) === selectedYear;
    const monthMatch = selectedMonth === 'All' || releaseDate.toLocaleString('en-US', { month: 'long' }) === selectedMonth;
    return yearMatch && monthMatch;
  });

  const formatRuntime = (date: string) => {
    if (!date) return 'TBA';
    const d = new Date(date);
    return d.getFullYear().toString();
  };

  const getRating = (vote: number) => (vote / 2).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          Movie<Text style={styles.logoRed}>Zone</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMovies}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Featured banner carousel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onBannerScroll}
            scrollEventThrottle={16}
            style={styles.bannerScroll}
          >
            {trending.slice(0, 5).map((movie: any) => (
              <TouchableOpacity
                key={movie.id}
                style={styles.bannerCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('MovieDetail', { movieId: movie.id })}
              >
                <Image
                  source={{ uri: getBackdropUrl(movie.backdrop_path) }}
                  style={styles.bannerImage}
                />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>{movie.title}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.ratingText}>{getRating(movie.vote_average)}</Text>
                    </View>
                    <Text style={styles.metaText}>{formatRuntime(movie.release_date)}</Text>
                    <Text style={styles.metaText}>{movie.original_language.toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.watchButton}
                    onPress={() => navigation.navigate('MovieDetail', { movieId: movie.id })}
                  >
                    <Text style={styles.watchButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.dotsRow}>
            {trending.slice(0, 5).map((_: any, i: number) => (
              <View
                key={i}
                style={[styles.dot, activeBanner === i && styles.dotActive]}
              />
            ))}
          </View>

          {/* Now Playing */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Now Playing</Text>
            <Text style={styles.sectionSubtitle}>Playing in theaters now</Text>
          </View>

          <FlatList
            data={nowPlaying}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: any) => String(item.id)}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={styles.movieCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
              >
                <View>
                  <Image
                    source={{ uri: getImageUrl(item.poster_path) }}
                    style={styles.moviePoster}
                  />
                  <TouchableOpacity style={styles.favoriteIcon}>
                    <Ionicons name="heart-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.movieDuration}>
                  {formatRuntime(item.release_date)}  {item.original_language.toUpperCase()}
                </Text>
                <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Watch Online */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Watch Online</Text>
            <Text style={styles.sectionSubtitle}>Stream now on MovieZone</Text>
          </View>

          <FlatList
            data={trending}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: any) => String(item.id)}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={styles.movieCard}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('Player', {
                    movieId: item.id,
                    title: item.title,
                    poster: item.poster_path,
                    backdrop: item.backdrop_path,
                    voteAverage: item.vote_average,
                  })
                }
              >
                <View>
                  <Image
                    source={{ uri: getImageUrl(item.poster_path) }}
                    style={styles.moviePoster}
                  />
                  <View style={styles.streamBadge}>
                    <Ionicons name="play" size={12} color="#FFFFFF" />
                  </View>
                </View>
                <Text style={styles.movieDuration}>
                  {formatRuntime(item.release_date)}  {item.original_language.toUpperCase()}
                </Text>
                <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Coming Soon */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Coming Soon</Text>
            <Text style={styles.sectionSubtitle}>
              Movies on their way to the big screen
            </Text>
          </View>

          <View style={styles.filterRow}>
            {years.map((y) => (
              <TouchableOpacity key={y} onPress={() => setSelectedYear(y)}>
                <Text
                  style={[
                    styles.filterText,
                    selectedYear === y && styles.filterTextActive,
                  ]}
                >
                  {y}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.filterDivider} />
            {months.slice(0, 4).map((m) => (
              <TouchableOpacity key={m} onPress={() => setSelectedMonth(m)}>
                <Text
                  style={[
                    styles.filterText,
                    selectedMonth === m && styles.filterTextActive,
                  ]}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filteredUpcoming}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: any) => String(item.id)}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={styles.comingSoonCard}
                onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
              >
                <Image
                  source={{ uri: getImageUrl(item.poster_path) }}
                  style={styles.comingSoonPoster}
                />
                <TouchableOpacity
                  style={styles.bookNowButton}
                  onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
                >
                  <Text style={styles.bookNowText}>Book Now</Text>
                </TouchableOpacity>
                <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.movieDuration}>{formatRuntime(item.release_date)}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarItem}>
          <Ionicons name="home" size={24} color="#E50914" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate('Watch')}
        >
          <Ionicons name="play-circle" size={26} color="#8A8A8A" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={24} color="#8A8A8A" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={24} color="#8A8A8A" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoRed: {
    color: '#E50914',
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
  retryButton: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bannerScroll: {
    marginTop: 8,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  bannerImage: {
    width: '100%',
    height: 420,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(18,18,18,0.55)',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginLeft: 3,
  },
  metaText: {
    color: '#CCCCCC',
    fontSize: 11,
    marginRight: 6,
  },
  watchButton: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#444444',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#E50914',
    width: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 2,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  movieCard: {
    width: 140,
    marginRight: 14,
  },
  moviePoster: {
    width: 140,
    height: 200,
    borderRadius: 12,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  streamBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(229,9,20,0.9)',
    borderRadius: 12,
    padding: 4,
  },
  movieDuration: {
    color: '#8A8A8A',
    fontSize: 11,
    marginTop: 8,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterText: {
    color: '#8A8A8A',
    fontSize: 13,
    marginRight: 12,
  },
  filterTextActive: {
    color: '#E50914',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  filterDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#333333',
    marginRight: 12,
  },
  comingSoonCard: {
    width: 150,
    marginRight: 14,
  },
  comingSoonPoster: {
    width: 150,
    height: 200,
    borderRadius: 12,
  },
  bookNowButton: {
    position: 'absolute',
    bottom: 40,
    left: 8,
    right: 8,
    backgroundColor: '#E50914',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  bottomBarItem: {
    padding: 8,
  },
});