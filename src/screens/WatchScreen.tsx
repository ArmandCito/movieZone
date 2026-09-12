import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
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
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getGenres,
  getMoviesByGenre,
  getImageUrl,
  getBackdropUrl,
} from '../services/tmdbService';
import { useUserData } from '../context/UserDataContext';
import { GlassCard, GlassButton, GlassTabBar, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

export default function WatchScreen({ navigation }: any) {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [genreMovies, setGenreMovies] = useState<any[]>([]);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGenre, setIsLoadingGenre] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { continueWatching } = useUserData();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [trendingData, popularData, topRatedData, genresData] = await Promise.all([
        getTrendingMovies('week'),
        getPopularMovies(),
        getTopRatedMovies(),
        getGenres(),
      ]);
      setTrending(trendingData.results);
      setPopular(popularData.results);
      setTopRated(topRatedData.results);
      setGenres(genresData.genres);
    } catch (err: any) {
      setError(err.message || 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreSelect = async (genreId: number) => {
    setActiveGenre(genreId);
    setIsLoadingGenre(true);
    try {
      const data = await getMoviesByGenre(genreId);
      setGenreMovies(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingGenre(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const data = await searchMovies(query);
      setSearchResults(data.results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getRating = (vote: number) => (vote / 2).toFixed(1);

  const goToWatch = (movie: any) => {
    navigation.navigate('Player', {
      movieId: movie.id,
      title: movie.title,
      backdrop: movie.backdrop_path,
      poster: movie.poster_path,
      voteAverage: movie.vote_average,
    });
  };

  const renderContinueRow = () => {
    if (continueWatching.length === 0) return null;
    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
        </View>
        <FlatList
          data={continueWatching}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: any) => String(item.movieId)}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={styles.posterCard}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('Player', {
                  movieId: item.movieId,
                  title: item.title,
                  backdrop: item.backdrop_path,
                  poster: item.poster_path,
                  voteAverage: item.vote_average,
                  resumeAt: Math.max(0, (item.progressSeconds || 0) - 10),
                })
              }
            >
              <View>
                <Image
                  source={{ uri: getImageUrl(item.poster_path) }}
                  style={styles.posterImage}
                />
                <GlassCard style={styles.resumeOverlay} radius={radii.sm} intensity={55} padded={false}>
                  <Ionicons name="play" size={16} color={colors.textPrimary} />
                  <Text style={styles.resumeText}>Resume</Text>
                </GlassCard>
              </View>
              <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </>
    );
  };

  // Trend banner carousel
  const bannerMovies = trending.slice(0, 5);

  return (
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container}>
        <GlassCard style={styles.header} radius={radii.lg} intensity={58} padded={false}>
          <Text style={styles.logo}>
            Watch<Text style={styles.logoRed}>Zone</Text>
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </GlassCard>

        <GlassCard style={styles.searchBar} radius={radii.md} intensity={55} padded={false}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies to watch online..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </GlassCard>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading content...</Text>
          </View>
        ) : error && trending.length === 0 ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <GlassButton label="Retry" variant="primary" style={styles.retryButton} onPress={loadMovies} />
          </View>
        ) : showSearchResults && isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : showSearchResults && searchResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="film-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No movies found for "{query}"</Text>
            <TouchableOpacity onPress={() => { setShowSearchResults(false); setSearchResults([]); }}>
              <Text style={styles.clearSearchText}>Clear search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {showSearchResults ? (
              <>
                <FlatList
                  data={searchResults}
                  scrollEnabled={false}
                  keyExtractor={(item: any) => String(item.id)}
                  contentContainerStyle={styles.searchResultsList}
                  renderItem={({ item }: any) => (
                    <GlassCard style={styles.searchResultRow} radius={radii.lg} intensity={58} padded={false}>
                      <TouchableOpacity
                        style={styles.searchResultTouch}
                        onPress={() => goToWatch(item)}
                      >
                        <Image
                          source={{ uri: getImageUrl(item.poster_path, 'w200') }}
                          style={styles.searchPoster}
                        />
                        <View style={styles.searchInfo}>
                          <Text style={styles.searchTitle} numberOfLines={1}>{item.title}</Text>
                          <Text style={styles.searchMeta}>
                            {item.release_date ? new Date(item.release_date).getFullYear() : 'TBA'}
                          </Text>
                          <View style={styles.ratingSmall}>
                            <Ionicons name="star" size={11} color="#FFD700" />
                            <Text style={styles.ratingSmallText}>{getRating(item.vote_average)}</Text>
                          </View>
                          <GlassButton
                            variant="primary"
                            style={styles.playButtonInline}
                            onPress={() => goToWatch(item)}
                          >
                            <View style={styles.playButtonInlineContent}>
                              <Ionicons name="play" size={12} color={colors.textPrimary} />
                              <Text style={styles.playButtonInlineText}>Play</Text>
                            </View>
                          </GlassButton>
                        </View>
                      </TouchableOpacity>
                    </GlassCard>
                  )}
                />
                <View style={{ height: 30 }} />
              </>
            ) : (
              <>
                {/* Featured banner carousel */}
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={styles.bannerScroll}
                >
                  {bannerMovies.map((movie: any) => (
                    <TouchableOpacity
                      key={movie.id}
                      style={styles.bannerCard}
                      activeOpacity={0.9}
                      onPress={() => goToWatch(movie)}
                    >
                      <Image
                        source={{ uri: getBackdropUrl(movie.backdrop_path) }}
                        style={styles.bannerImage}
                      />
                      <GlassCard style={styles.bannerOverlay} radius={radii.lg} intensity={62}>
                        <GlassCard
                          style={styles.streamBadge}
                          radius={radii.sm}
                          intensity={55}
                          tintColor="rgba(229,9,20,0.35)"
                          padded={false}
                        >
                          <Text style={styles.streamBadgeText}>STREAM NOW</Text>
                        </GlassCard>
                        <Text style={styles.bannerTitle}>{movie.title}</Text>
                        <View style={styles.bannerMeta}>
                          <Text style={styles.bannerMetaText}>
                            {movie.original_language.toUpperCase()}
                          </Text>
                          <GlassCard style={styles.ratingBadge} radius={radii.pill} intensity={55} padded={false}>
                            <Ionicons name="star" size={12} color="#FFD700" />
                            <Text style={styles.ratingText}>{getRating(movie.vote_average)}</Text>
                          </GlassCard>
                          {movie.release_date && (
                            <Text style={styles.bannerMetaText}>
                              {new Date(movie.release_date).getFullYear()}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.bannerOverview} numberOfLines={2}>
                          {movie.overview}
                        </Text>
                        <GlassButton
                          variant="primary"
                          style={styles.playButton}
                          onPress={() => goToWatch(movie)}
                        >
                          <View style={styles.playButtonContent}>
                            <Ionicons name="play" size={18} color={colors.textPrimary} />
                            <Text style={styles.playButtonText}>Watch Now</Text>
                          </View>
                        </GlassButton>
                      </GlassCard>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {renderContinueRow()}

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Trending Now</Text>
                </View>
                <FlatList
                  data={trending}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any) => String(item.id)}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }: any) => (
                    <TouchableOpacity
                      style={styles.posterCard}
                      onPress={() => goToWatch(item)}
                    >
                      <View>
                        <Image
                          source={{ uri: getImageUrl(item.poster_path) }}
                          style={styles.posterImage}
                        />
                        <GlassCard style={styles.playIcon} radius={radii.pill} intensity={55} padded={false}>
                          <TouchableOpacity style={styles.playIconTouch}>
                            <Ionicons name="play" size={18} color={colors.textPrimary} />
                          </TouchableOpacity>
                        </GlassCard>
                      </View>
                      <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />

                {/* Genres */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Browse by Genre</Text>
                </View>
                <FlatList
                  data={genres}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any) => String(item.id)}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }: any) => (
                    <GlassCard
                      style={styles.genrePill}
                      radius={radii.pill}
                      intensity={58}
                      tintColor={activeGenre === item.id ? colors.accentSoft : colors.glassFill}
                      padded={false}
                    >
                      <TouchableOpacity
                        style={styles.genrePillTouch}
                        onPress={() => handleGenreSelect(item.id)}
                      >
                        <Text
                          style={[
                            styles.genrePillText,
                            activeGenre === item.id && styles.genrePillTextActive,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </GlassCard>
                  )}
                />

                {activeGenre && (
                  isLoadingGenre ? (
                    <View style={styles.miniLoading}>
                      <ActivityIndicator color={colors.accent} size="small" />
                    </View>
                  ) : (
                    <FlatList
                      data={genreMovies}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item: any) => String(item.id)}
                      contentContainerStyle={styles.horizontalList}
                      renderItem={({ item }: any) => (
                        <TouchableOpacity
                          style={styles.posterCard}
                          onPress={() => goToWatch(item)}
                        >
                          <View>
                            <Image source={{ uri: getImageUrl(item.poster_path) }} style={styles.posterImage} />
                            <GlassCard style={styles.playIcon} radius={radii.pill} intensity={55} padded={false}>
                              <TouchableOpacity style={styles.playIconTouch}>
                                <Ionicons name="play" size={18} color={colors.textPrimary} />
                              </TouchableOpacity>
                            </GlassCard>
                          </View>
                          <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  )
                )}

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Popular on MovieZone</Text>
                </View>
                <FlatList
                  data={popular}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any) => String(item.id)}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }: any) => (
                    <TouchableOpacity style={styles.posterCard} onPress={() => goToWatch(item)}>
                      <View>
                        <Image source={{ uri: getImageUrl(item.poster_path) }} style={styles.posterImage} />
                        <GlassCard style={styles.playIcon} radius={radii.pill} intensity={55} padded={false}>
                          <TouchableOpacity style={styles.playIconTouch}>
                            <Ionicons name="play" size={18} color={colors.textPrimary} />
                          </TouchableOpacity>
                        </GlassCard>
                      </View>
                      <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Top Rated</Text>
                </View>
                <FlatList
                  data={topRated}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any) => String(item.id)}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }: any) => (
                    <TouchableOpacity style={styles.posterCard} onPress={() => goToWatch(item)}>
                      <View>
                        <Image
                          source={{ uri: getImageUrl(item.poster_path) }}
                          style={styles.topRatedImage}
                        />
                        <GlassCard
                          style={styles.rankBadge}
                          radius={radii.pill}
                          intensity={55}
                          tintColor="rgba(229,9,20,0.35)"
                          padded={false}
                        >
                          <Text style={styles.rankText}>{topRated.indexOf(item) + 1}</Text>
                        </GlassCard>
                        <GlassCard style={styles.playIcon} radius={radii.pill} intensity={55} padded={false}>
                          <TouchableOpacity style={styles.playIconTouch}>
                            <Ionicons name="play" size={18} color={colors.textPrimary} />
                          </TouchableOpacity>
                        </GlassCard>
                      </View>
                      <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />

                <View style={{ height: 100 }} />
              </>
            )}
          </ScrollView>
        )}

        {/* Bottom Navigation */}
        <GlassTabBar active="Watch" navigation={navigation} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginTop: 8,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  logoRed: {
    color: colors.accent,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  searchButton: {
    padding: 10,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  clearSearchText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20,
  },
  bannerScroll: {
    marginTop: 16,
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
  },
  streamBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  streamBadgeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  bannerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  bannerMetaText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginRight: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: 11,
    marginLeft: 3,
  },
  bannerOverview: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  playButton: {},
  playButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
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
  horizontalList: {
    paddingHorizontal: 20,
  },
  posterCard: {
    width: 140,
    marginRight: 14,
  },
  posterImage: {
    width: 140,
    height: 200,
    borderRadius: 12,
  },
  topRatedImage: {
    width: 140,
    height: 200,
    borderRadius: 12,
  },
  playIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  playIconTouch: {
    padding: 6,
  },
  rankBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  movieTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  genrePill: {
    marginRight: 10,
  },
  genrePillTouch: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  genrePillText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  genrePillTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  miniLoading: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  resumeOverlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 2,
  },
  searchResultsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchResultRow: {
    marginBottom: 12,
  },
  searchResultTouch: {
    flexDirection: 'row',
    padding: 12,
  },
  searchPoster: {
    width: 90,
    height: 130,
    borderRadius: 8,
  },
  searchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  searchMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  ratingSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingSmallText: {
    color: colors.textPrimary,
    fontSize: 12,
    marginLeft: 4,
  },
  playButtonInline: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  playButtonInlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  playButtonInlineText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
});
