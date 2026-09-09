import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../services/tmdbService';
import { useUserData } from '../context/UserDataContext';

export default function FavoritesScreen({ navigation }: any) {
  const { favorites, toggleFavorite } = useUserData();

  const getRating = (vote: number) => (vote ? (vote / 2).toFixed(1) : 'N/A');

  const getYear = (date?: string) => {
    if (!date) return 'TBA';
    return new Date(date).getFullYear();
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.logo}>My Favorites</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.emptyWrap}>
          <Ionicons name="heart-half" size={52} color="#555555" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyBody}>
            Tap the heart on any movie you love to keep it here for quick access.
          </Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.browseText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.logo}>My Favorites</Text>
        <Text style={styles.count}>{favorites.length}</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
              style={styles.cardLeft}
            >
              <Image
                source={{ uri: getImageUrl(item.poster_path, 'w200') }}
                style={styles.poster}
              />
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.metaText}>{getYear(item.release_date)}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color="#FFD700" />
                  <Text style={styles.ratingText}>{getRating(item.vote_average)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.watchBtn}
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
                  <Ionicons name="play" size={13} color="#FFFFFF" />
                  <Text style={styles.watchText}>Watch Online</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.unfavBtn} onPress={() => toggleFavorite(item)}>
              <Ionicons name="heart" size={20} color="#E50914" />
            </TouchableOpacity>
          </View>
        )}
      />
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
    paddingVertical: 10,
  },
  backBtn: { padding: 6 },
  logo: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  count: { color: '#E50914', fontSize: 15, fontWeight: '700', width: 32, textAlign: 'right', marginRight: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  cardLeft: { flexDirection: 'row', flex: 1 },
  poster: { width: 70, height: 105, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, paddingRight: 8 },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  metaText: { color: '#8A8A8A', fontSize: 12, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  ratingText: { color: '#FFFFFF', fontSize: 12 },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E50914',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    gap: 4,
  },
  watchText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  unfavBtn: { justifyContent: 'center', paddingHorizontal: 6 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 36 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 14 },
  emptyBody: { color: '#8A8A8A', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  browseBtn: { backgroundColor: '#E50914', borderRadius: 10, paddingHorizontal: 26, paddingVertical: 12, marginTop: 20 },
  browseText: { color: '#FFFFFF', fontWeight: '700' },
});