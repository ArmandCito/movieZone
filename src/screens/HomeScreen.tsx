import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { featuredMovies, nowPlaying, comingSoon } from '../data/mockData';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

export default function HomeScreen({ navigation }: any) {
  const [activeBanner, setActiveBanner] = useState(0);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedMonth, setSelectedMonth] = useState('January');

  const onBannerScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setActiveBanner(index);
  };

  const years = ['2023', 'All'];
  const months = ['January', 'February', 'March'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          Movie<Text style={styles.logoRed}>Zone</Text>
        </Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
          {featuredMovies.map((movie: any) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.bannerCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('MovieDetail', { movie })}
            >
              <Image source={{ uri: movie.banner }} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>{movie.title}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{movie.rating}</Text>
                  </View>
                  <View style={styles.classificationBadge}>
                    <Text style={styles.classificationText}>
                      {movie.classification}
                    </Text>
                  </View>
                  <Text style={styles.metaText}>{movie.year}</Text>
                  <Text style={styles.metaText}>{movie.duration}</Text>
                  <Text style={styles.metaText}>{movie.genre}</Text>
                </View>
                <TouchableOpacity
                  style={styles.watchButton}
                  onPress={() => navigation.navigate('MovieDetail', { movie })}
                >
                  <Text style={styles.watchButtonText}>Watch Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dotsRow}>
          {featuredMovies.map((_: any, i: number) => (
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
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={styles.movieCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('MovieDetail', { movie: item })}
            >
              <View>
                <Image source={{ uri: item.poster }} style={styles.moviePoster} />
                <TouchableOpacity style={styles.favoriteIcon}>
                  <Ionicons name="heart-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.timesRow}>
                  {item.times.slice(0, 2).map((t: any) => (
                    <View key={t} style={styles.timeBadge}>
                      <Text style={styles.timeBadgeText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.movieDuration}>
                {item.duration}   {item.classification}
              </Text>
              <Text style={styles.movieTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Coming Soon */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Coming Soon This Year</Text>
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
          {months.map((m) => (
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
          data={comingSoon}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }: any) => (
            <View style={styles.comingSoonCard}>
              <Image source={{ uri: item.poster }} style={styles.comingSoonPoster} />
              <TouchableOpacity style={styles.bookNowButton}>
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
              <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
          )}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarItem}>
          <Ionicons name="home" size={24} color="#E50914" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem}>
          <Ionicons name="search" size={24} color="#8A8A8A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem}>
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
  classificationBadge: {
    borderWidth: 1,
    borderColor: '#8A8A8A',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginRight: 6,
  },
  classificationText: {
    color: '#FFFFFF',
    fontSize: 11,
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
  timesRow: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
  },
  timeBadge: {
    backgroundColor: '#E50914',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
  },
  timeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
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
  },
  filterText: {
    color: '#8A8A8A',
    fontSize: 13,
    marginRight: 16,
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
    marginRight: 16,
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
