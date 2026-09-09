import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchMovies, getImageUrl } from '../services/tmdbService';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.logo}>
          Movie<Text style={styles.logoRed}>Zone</Text>
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor="#8A8A8A"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hasSearched && results.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="film-outline" size={48} color="#8A8A8A" />
          <Text style={styles.noResultsText}>No movies found for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item: any) => String(item.id)}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={styles.resultCard}
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
              <Ionicons name="chevron-forward" size={18} color="#8A8A8A" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#8A8A8A" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate('Watch')}
        >
          <Ionicons name="play-circle" size={26} color="#8A8A8A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem}>
          <Ionicons name="search" size={24} color="#E50914" />
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
  backButton: {
    padding: 4,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoRed: {
    color: '#E50914',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    padding: 10,
    marginLeft: 8,
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
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    color: '#8A8A8A',
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
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  resultYear: {
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  resultOverview: {
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
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