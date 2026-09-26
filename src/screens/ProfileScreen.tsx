import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { formatFirebaseError } from '../services/firebaseService';
import { GlassCard, GlassButton, GlassIconButton, GlassTabBar, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { favoriteCount, bookingCount } = useUserData();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setError('');
    try {
      await signOut();
    } catch (err) {
      setError(formatFirebaseError(err));
    } finally {
      setSigningOut(false);
    }
  };

  const getInitials = () => {
    const name = user?.displayName || user?.email || 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    return user?.displayName || 'MovieZone User';
  };

  const getEmail = () => {
    return user?.email || 'No email';
  };

  const getMemberSince = () => {
    if (user?.creationTime) {
      return new Date(user.creationTime).toLocaleDateString('en-US', {
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

  return (
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <GlassIconButton icon="arrow-back" size={22} onPress={() => navigation.goBack()} style={styles.backButton} />
          <Text style={styles.logo}>
            Movie<Text style={styles.logoRed}>Zone</Text>
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <GlassCard style={styles.profileHeader} radius={radii.xl} intensity={72}>
            <View style={styles.avatar}>
              {user?.photoUrl ? (
                <Image
                  source={{ uri: user.photoUrl }}
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
          {error ? <Text accessibilityRole="alert" style={{ color: colors.danger, marginHorizontal: 20 }}>{error}</Text> : null}
          <GlassButton
            variant="danger"
            loading={signingOut}
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
        <GlassTabBar active="Profile" navigation={navigation} />
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
  backButton: { minWidth: 40, minHeight: 40 },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  logoRed: {
    color: colors.accent,
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
});
