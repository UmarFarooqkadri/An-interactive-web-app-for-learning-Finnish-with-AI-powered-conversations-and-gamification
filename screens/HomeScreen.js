import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FortuneWheel from '../components/FortuneWheel';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';

const HomeScreen = ({ allWheelSegments, onSpinEnd, userStats }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Learn Finnish</Text>
        <Text style={styles.subtitle}>Spin the wheel to start learning!</Text>
      </View>

      {/* Streak Card */}
      <View style={styles.streakCard}>
        <View style={styles.streakIcon}>
          <Text style={styles.fireIcon}>🔥</Text>
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{userStats?.streak || 0}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
        <View style={styles.streakDivider} />
        <View style={styles.xpInfo}>
          <Text style={styles.xpNumber}>{userStats?.xp || 0}</Text>
          <Text style={styles.xpLabel}>total XP</Text>
        </View>
      </View>

      {/* Fortune Wheel Card */}
      <View style={styles.wheelCard}>
        <Text style={styles.wheelTitle}>Today's Topic</Text>
        <Text style={styles.wheelSubtitle}>Tap SPIN to choose your lesson</Text>

        <View style={styles.wheelContainer}>
          <FortuneWheel onSpinEnd={onSpinEnd} segments={allWheelSegments} />
        </View>
      </View>

      {/* Tips Card */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsIcon}>💡</Text>
        <View style={styles.tipsContent}>
          <Text style={styles.tipsTitle}>Pro Tip</Text>
          <Text style={styles.tipsText}>
            Practice with a partner for better results! Check the Partners tab.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extraBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  streakCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: `${COLORS.accentOrange}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  fireIcon: {
    fontSize: 28,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extraBold,
    color: COLORS.textPrimary,
  },
  streakLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  xpInfo: {
    alignItems: 'flex-end',
  },
  xpNumber: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extraBold,
    color: COLORS.primary,
  },
  xpLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  wheelCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  wheelTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  wheelSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  wheelContainer: {
    alignItems: 'center',
  },
  tipsCard: {
    backgroundColor: `${COLORS.accent}15`,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: `${COLORS.accent}40`,
  },
  tipsIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  tipsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;
