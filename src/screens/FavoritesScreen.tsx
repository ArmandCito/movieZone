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
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

export default function FavoritesScreen({ navigation }: any) {
  const { favorites, toggleFavorite } = useUserData();

  const getRating = (vote: number) => (vote ? (vote / 2).toFixed(1) : 'N/A');

  const getYear = (date?: string) => {
    if (!date) return 'TBA';
    return new Date(date).getFullYear();
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.root}>
        <LiquidBackground />
        <SafeAreaView style={styles.container}>
          <GlassCard style={styles.header} radius={radii.lg} intensity={25} padded={false}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.logo}>My Favorites</Text>
            <View style={{ width: 32 }} />
          </GlassCard>
          <View style={styles.emptyWrap}>
            <GlassCard style={styles.emptyCard} radius={radii.lg} intensity={30}>
              <Ionicons name="heart-half" size={52} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptyBody}>
                Tap the heart on any movie you love to keep it here for quick access.
              </Text>
              <GlassButton
                label="Browse Movies"
                variant="primary"
                style={styles.browseBtn}
                onPress={() => navigation.navigate('Home')}
              />
            </GlassCard>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LiquidBackground />
      <SafeAreaView style={styles.container}>
        <GlassCard style={styles.header} radius={radii.lg} intensity={25} padded={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.logo}>My Favorites</Text>
          <Text style={styles.count}>{favorites.length}</Text>
        </GlassCard>

        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <GlassCard style={styles.card} radius={radii.lg} intensity={30} padded={false}>
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
                  <GlassCard
                    style={styles.watchBtn}
                    radius={radii.sm}
                    intensity={25}
                    tintColor={colors.accentSoft}
                    padded={false}
                  >
                    <TouchableOpacity
                      style={styles.watchBtnTouch}
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
                      <Ionicons name="play" size={13} color={colors.textPrimary} />
                      <Text style={styles.watchText}>Watch Online</Text>
                    </TouchableOpacity>
                  </GlassCard>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.unfavBtn} onPress={() => toggleFavorite(item)}>
                <Ionicons name="heart" size={20} color={colors.accent} />
              </TouchableOpacity>
            </GlassCard>
          )}
        />
      </SafeAreaView>
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
    paddingVertical: 10,
    marginHorizontal: 12,
    marginTop: 8,
  },
  backBtn: { padding: 6 },
  logo: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  count: { color: colors.accent, fontSize: 15, fontWeight: '700', width: 32, textAlign: 'right', marginRight: 8 },
  listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 },
  card: {
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  cardLeft: { flexDirection: 'row', flex: 1 },
  poster: { width: 70, height: 105, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, paddingRight: 8 },
  title: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  metaText: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  ratingText: { color: colors.textPrimary, fontSize: 12 },
  watchBtn: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  watchBtnTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  watchText: { color: colors.textPrimary, fontSize: 11, fontWeight: '700' },
  unfavBtn: { justifyContent: 'center', paddingHorizontal: 6 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 36 },
  emptyCard: { alignItems: 'center', width: '100%' },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 14 },
  emptyBody: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  browseBtn: { marginTop: 20, width: '100%' },
});
