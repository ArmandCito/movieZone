import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { getUserInfo } from '../services/firebaseService';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { favoriteCount, bookingCount } = useUserData();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.idToken) {
      loadUserInfo();
    } else {
      setIsLoading(false);
    }
  }, [user?.idToken]);

  const loadUserInfo = async () => {
    setIsLoading(true);
    try {
      const data = await getUserInfo(user!.idToken);
      if (data.users && data.users.length > 0) {
        setUserInfo(data.users[0]);
      }
    } catch (err) {
      console.error('Failed to load user info', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Intro' }],
    });
  };

  const getInitials = () => {
    const name = userInfo?.displayName || user?.displayName || user?.email || 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    return userInfo?.displayName || user?.displayName || 'MovieZone User';
  };

  const getEmail = () => {
    return userInfo?.email || user?.email || 'No email';
  };

  const getMemberSince = () => {
    if (userInfo?.createdAt) {
      return new Date(parseInt(userInfo.createdAt)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
    }
    return 'Recently';
  };

  const menuItems: { icon: any; label: string; color: string; screen?: string }[] = [
    { icon: 'heart-outline', label: 'My Favorites', color: '#E50914', screen: 'Favorites' },
    { icon: 'ticket-outline', label: 'My Bookings', color: '#E50914', screen: 'MyBookings' },
    { icon: 'settings-outline', label: 'Settings', color: '#E50914', screen: 'Settings' },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#E50914' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            {userInfo?.photoUrl ? (
              <Image
                source={{ uri: userInfo.photoUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>{getInitials()}</Text>
            )}
          </View>
          <Text style={styles.name}>{getDisplayName()}</Text>
          <Text style={styles.email}>{getEmail()}</Text>
          <View style={styles.memberBadgeRow}>
            <Ionicons name="calendar-outline" size={14} color="#8A8A8A" />
            <Text style={styles.memberSince}>Member since {getMemberSince()}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.statValue}>{favoriteCount}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('MyBookings')}
          >
            <Text style={styles.statValue}>{bookingCount}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </TouchableOpacity>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Rewards</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Account</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => {
                if (item.screen) navigation.navigate(item.screen);
              }}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#8A8A8A" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#E50914" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

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
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={24} color="#8A8A8A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem}>
          <Ionicons name="person" size={24} color="#E50914" />
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
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: '#8A8A8A',
    fontSize: 13,
    marginBottom: 8,
  },
  memberBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberSince: {
    color: '#8A8A8A',
    fontSize: 12,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 4,
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  menuTitle: {
    color: '#8A8A8A',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 24,
  },
  signOutText: {
    color: '#E50914',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
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