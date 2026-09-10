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
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

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
    { icon: 'heart-outline', label: 'My Favorites', color: colors.accent, screen: 'Favorites' },
    { icon: 'ticket-outline', label: 'My Bookings', color: colors.accent, screen: 'MyBookings' },
    { icon: 'settings-outline', label: 'Settings', color: colors.accent, screen: 'Settings' },
    { icon: 'help-circle-outline', label: 'Help & Support', color: colors.accent },
  ];

  if (isLoading) {
    return (
      <View style={styles.root}>
        <LiquidBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
        </LiquidBackground>
      </View>
    );
  }

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

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <GlassCard style={styles.profileHeader} radius={radii.xl} intensity={72}>
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
              <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
              <Text style={styles.memberSince}>Member since {getMemberSince()}</Text>
            </View>
          </GlassCard>

          {/* Stats */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statCardTouch}
              onPress={() => navigation.navigate('Favorites')}
            >
              <GlassCard style={styles.statCard} radius={radii.md} intensity={58}>
                <Text style={styles.statValue}>{favoriteCount}</Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </GlassCard>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statCardTouch}
              onPress={() => navigation.navigate('MyBookings')}
            >
              <GlassCard style={styles.statCard} radius={radii.md} intensity={58}>
                <Text style={styles.statValue}>{bookingCount}</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </GlassCard>
            </TouchableOpacity>
            <View style={styles.statCardTouch}>
              <GlassCard style={styles.statCard} radius={radii.md} intensity={58}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Rewards</Text>
              </GlassCard>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={styles.menuTitle}>Account</Text>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  if (item.screen) navigation.navigate(item.screen);
                }}
              >
                <GlassCard style={styles.menuItem} radius={radii.md} intensity={58}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign Out */}
          <GlassButton
            variant="danger"
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <View style={styles.signOutContent}>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </View>
          </GlassButton>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <GlassCard style={styles.bottomBar} radius={radii.xl} intensity={68} padded={false}>
          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home" size={24} color={colors.textMuted} />
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
          <TouchableOpacity style={styles.bottomBarItem}>
            <Ionicons name="person" size={24} color={colors.accent} />
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
  profileHeader: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accent,
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
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  memberBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberSince: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statCardTouch: {
    flex: 1,
    marginHorizontal: 6,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  menuTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.glassBorderSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  signOutButton: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
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
