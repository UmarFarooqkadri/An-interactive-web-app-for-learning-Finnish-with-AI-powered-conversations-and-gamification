import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';
import { getLeaderboard, getUserStats } from '../services/firestoreService';

// Mock leaderboard data - replace with real Firebase data later
const MOCK_LEADERBOARD = [
  { id: '1', name: 'Anna K.', xp: 2450, streak: 15, level: 12, avatar: 'A' },
  { id: '2', name: 'Mikko L.', xp: 2280, streak: 12, level: 11, avatar: 'M' },
  { id: '3', name: 'Sofia R.', xp: 2150, streak: 20, level: 10, avatar: 'S' },
  { id: '4', name: 'Jukka P.', xp: 1920, streak: 8, level: 9, avatar: 'J' },
  { id: '5', name: 'Laura M.', xp: 1750, streak: 14, level: 9, avatar: 'L' },
  { id: '6', name: 'Timo V.', xp: 1680, streak: 10, level: 8, avatar: 'T' },
  { id: '7', name: 'Emma S.', xp: 1520, streak: 7, level: 7, avatar: 'E' },
  { id: '8', name: 'Ville H.', xp: 1380, streak: 11, level: 7, avatar: 'V' },
  { id: '9', name: 'Kaisa T.', xp: 1210, streak: 5, level: 6, avatar: 'K' },
  { id: '10', name: 'Pekka J.', xp: 1050, streak: 9, level: 6, avatar: 'P' },
];

const getMedalEmoji = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}`;
};

const getAvatarColor = (index) => {
  const colors = [COLORS.primary, COLORS.secondary, COLORS.accentOrange, COLORS.accent];
  return colors[index % colors.length];
};

const LeaderboardScreen = ({ currentUser, userStats }) => {
  const [timeframe, setTimeframe] = useState('all'); // 'week', 'month', 'all'
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboard(100);
        setLeaderboardData(data);

        if (currentUser && userStats) {
          const rank = data.findIndex(entry => entry.id === currentUser.uid);
          setUserRank(rank !== -1 ? rank + 1 : null);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [currentUser, userStats]);

  const currentUserStats = userStats || {
    xp: 0,
    streak: 0,
    level: 1,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Compete with Finnish learners worldwide</Text>
      </View>

      {/* Your Rank Card */}
      {currentUser && (
        <View style={styles.yourRankCard}>
          <View style={styles.yourRankHeader}>
            <Text style={styles.yourRankTitle}>Your Rank</Text>
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>
                #{userRank || '-'}
              </Text>
            </View>
          </View>

          <View style={styles.yourStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUserStats.xp}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUserStats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Lvl {currentUserStats.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
        </View>
      )}

      {/* Timeframe Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, timeframe === 'week' && styles.tabActive]}
          onPress={() => setTimeframe('week')}
        >
          <Text style={[styles.tabText, timeframe === 'week' && styles.tabTextActive]}>
            This Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, timeframe === 'month' && styles.tabActive]}
          onPress={() => setTimeframe('month')}
        >
          <Text style={[styles.tabText, timeframe === 'month' && styles.tabTextActive]}>
            This Month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, timeframe === 'all' && styles.tabActive]}
          onPress={() => setTimeframe('all')}
        >
          <Text style={[styles.tabText, timeframe === 'all' && styles.tabTextActive]}>
            All Time
          </Text>
        </TouchableOpacity>
      </View>

      {/* How to Earn XP Card */}
      <View style={styles.xpInfoCard}>
        <Text style={styles.xpInfoTitle}>💎 How to Earn XP</Text>
        <View style={styles.xpInfoList}>
          <Text style={styles.xpInfoItem}>• AI Chat Message: <Text style={styles.xpBold}>10 XP</Text></Text>
          <Text style={styles.xpInfoItem}>• Complete Scenario: <Text style={styles.xpBold}>50 XP</Text></Text>
          <Text style={styles.xpInfoItem}>• Spin the Wheel: <Text style={styles.xpBold}>20 XP</Text></Text>
          <Text style={styles.xpInfoItem}>• Daily Login: <Text style={styles.xpBold}>25 XP</Text></Text>
          <Text style={styles.xpInfoItem}>• Video Practice: <Text style={styles.xpBold}>100 XP</Text></Text>
        </View>
      </View>

      {/* Leaderboard List */}
      <ScrollView style={styles.leaderboardList} showsVerticalScrollIndicator={false}>
        <View style={styles.leaderboardHeader}>
          <Text style={styles.leaderboardHeaderText}>Top Learners</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : leaderboardData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No users on the leaderboard yet. Start practicing to be the first!
            </Text>
          </View>
        ) : (
          leaderboardData.slice(0, 10).map((user, index) => {
            const userName = user.displayName || user.email?.split('@')[0] || 'User';
            const avatar = userName.charAt(0).toUpperCase();

            return (
              <View
                key={user.id}
                style={[
                  styles.leaderboardItem,
                  index < 3 && styles.topThreeItem,
                ]}
              >
                {/* Rank */}
                <View style={styles.rankContainer}>
                  {index < 3 ? (
                    <Text style={styles.medalEmoji}>{getMedalEmoji(index + 1)}</Text>
                  ) : (
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  )}
                </View>

                {/* Avatar */}
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: getAvatarColor(index) },
                  ]}
                >
                  <Text style={styles.avatarText}>{avatar}</Text>
                </View>

                {/* User Info */}
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userName}</Text>
                  <View style={styles.userStats}>
                    <Text style={styles.userStatText}>
                      🔥 {user.streak || 0} day streak
                    </Text>
                    <Text style={styles.userStatDot}>•</Text>
                    <Text style={styles.userStatText}>Lvl {user.level || 1}</Text>
                  </View>
                </View>

                {/* XP */}
                <View style={styles.xpContainer}>
                  <Text style={styles.xpValue}>{user.xp || 0}</Text>
                  <Text style={styles.xpLabel}>XP</Text>
                </View>
              </View>
            );
          })
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  yourRankCard: {
    backgroundColor: `${COLORS.primary}15`,
    margin: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  yourRankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  yourRankTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  rankBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
  },
  rankBadgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  yourStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extraBold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: `${COLORS.primary}30`,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  xpInfoCard: {
    backgroundColor: `${COLORS.accent}15`,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: `${COLORS.accent}40`,
  },
  xpInfoTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  xpInfoList: {
    gap: SPACING.xs,
  },
  xpInfoItem: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  xpBold: {
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  leaderboardHeaderText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  loadingContainer: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  leaderboardItem: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  topThreeItem: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    ...SHADOWS.medium,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  medalEmoji: {
    fontSize: 28,
  },
  rankNumber: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.extraBold,
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  userStatDot: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginHorizontal: SPACING.xs,
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.extraBold,
    color: COLORS.primary,
  },
  xpLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default LeaderboardScreen;
