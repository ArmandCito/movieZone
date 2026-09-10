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
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

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
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            Movie<Text style={styles.logoRed}>Zone</Text>
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading movies...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <GlassButton
              label="Retry"
              variant="primary"
              style={styles.retryButton}
              textStyle={styles.retryButtonText}
              onPress={loadMovies}
            />
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
                  <GlassCard
                    style={styles.bannerOverlay}
                    radius={radii.md}
                    intensity={62}
                    tintColor={colors.glassFillStrong}
                    padded={false}
                  >
                    <Text style={styles.bannerTitle}>{movie.title}</Text>
                    <View style={styles.metaRow}>
                      <GlassCard
                        style={styles.ratingBadge}
                        radius={radii.pill}
                        intensity={55}
                        padded={false}
                      >
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>{getRating(movie.vote_average)}</Text>
                      </GlassCard>
                      <Text style={styles.metaText}>{formatRuntime(movie.release_date)}</Text>
                      <Text style={styles.metaText}>{movie.original_language.toUpperCase()}</Text>
                    </View>
                    <GlassButton
                      label="Book Now"
                      variant="primary"
                      style={styles.watchButton}
                      textStyle={styles.watchButtonText}
                      onPress={() => navigation.navigate('MovieDetail', { movieId: movie.id })}
                    />
                  </GlassCard>
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
                    <GlassCard
                      style={styles.favoriteIcon}
                      radius={radii.pill}
                      intensity={55}
                      padded={false}
                    >
                      <TouchableOpacity style={styles.favoriteIconTouch}>
                        <Ionicons name="heart-outline" size={18} color={colors.textPrimary} />
                      </TouchableOpacity>
                    </GlassCard>
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
                    <GlassCard
                      style={styles.streamBadge}
                      radius={radii.pill}
                      intensity={55}
                      tintColor="rgba(229,9,20,0.35)"
                      padded={false}
                    >
                      <Ionicons name="play" size={12} color={colors.textPrimary} />
                    </GlassCard>
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
                  <GlassButton
                    label="Book Now"
                    variant="primary"
                    style={styles.bookNowButton}
                    textStyle={styles.bookNowText}
                    onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
                  />
                  <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.movieDuration}>{formatRuntime(item.release_date)}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={{ height: 100 }} />
          </ScrollView>
        )}

        {/* Bottom Navigation */}
        <GlassCard style={styles.bottomBar} radius={radii.xl} padded={false}>
          <TouchableOpacity style={styles.bottomBarItem}>
            <Ionicons name="home" size={24} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={() => navigation.navigate('Watch')}
          >
            <Ionicons name="play-circle" size={26} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search" size={24} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </GlassCard>
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
    color: colors.textPrimary,
  },
  logoRed: {
    color: colors.accent,
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
    color: colors.accent,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    minWidth: 140,
  },
  retryButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    paddingHorizontal: 24,
  },
  bannerScroll: {
    marginTop: 8,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
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
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: 11,
    marginLeft: 3,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginRight: 6,
  },
  watchButton: {
    width: '100%',
  },
  watchButtonText: {
    color: colors.textPrimary,
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
    backgroundColor: colors.glassBorderSoft,
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: colors.accent,
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
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
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
    width: 30,
    height: 30,
  },
  favoriteIconTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streamBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  movieDuration: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 8,
  },
  movieTitle: {
    color: colors.textPrimary,
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
    color: colors.textMuted,
    fontSize: 13,
    marginRight: 12,
  },
  filterTextActive: {
    color: colors.accent,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  filterDivider: {
    width: 1,
    height: 14,
    backgroundColor: colors.glassBorderSoft,
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
  },
  bookNowText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
  },
  bottomBarItem: {
    padding: 8,
  },
});
