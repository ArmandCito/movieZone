import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchMovies, getImageUrl } from '../services/tmdbService';
import { GlassCard, GlassTabBar, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await searchMovies(query.trim());
      setResults(data.results);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatYear = (date: string) => {
    if (!date) return 'TBA';
    return new Date(date).getFullYear().toString();
  };

  return (
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.logo}>
            Movie<Text style={styles.logoRed}>Zone</Text>
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <GlassCard style={styles.searchBar} radius={radii.md} intensity={55} padded={false}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </GlassCard>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : hasSearched && results.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <GlassCard style={styles.noResultsCard} radius={radii.lg}>
              <Ionicons name="film-outline" size={48} color={colors.textMuted} />
              <Text style={styles.noResultsText}>No movies found for "{query}"</Text>
            </GlassCard>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item: any) => String(item.id)}
            contentContainerStyle={styles.resultsList}
            renderItem={({ item }: any) => (
              <GlassCard style={styles.resultCard} radius={radii.md} padded={false}>
                <TouchableOpacity
                  style={styles.resultCardTouch}
                  onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
                >
                  <Image
                    source={{ uri: getImageUrl(item.poster_path, 'w200') }}
                    style={styles.resultPoster}
                  />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.resultYear}>{formatYear(item.release_date)}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.ratingText}>{(item.vote_average / 2).toFixed(1)}</Text>
                    </View>
                    <Text style={styles.resultOverview} numberOfLines={3}>
                      {item.overview || 'No overview available.'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </GlassCard>
            )}
          />
        )}

        {/* Bottom Navigation */}
        <GlassTabBar active="Search" navigation={navigation} />
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
  backButton: {
    padding: 4,
  },
  logo: {
    fontSize: 20,
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
    marginTop: 8,
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
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  noResultsText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  resultCard: {
    marginBottom: 12,
  },
  resultCardTouch: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  resultPoster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  resultYear: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: 12,
    marginLeft: 4,
  },
  resultOverview: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
  },
});
