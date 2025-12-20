import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';

const NavItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity
    style={styles.navItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
      <Text style={[styles.icon, active && styles.iconActive]}>{icon}</Text>
    </View>
    <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
  </TouchableOpacity>
);

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: '🤖', label: 'Home' },
    { id: 'practice', icon: '🎯', label: 'Practice' },
    { id: 'podcast', icon: '🎧', label: 'Podcast' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <NavItem
          key={tab.id}
          icon={tab.icon}
          label={tab.label}
          active={activeTab === tab.id}
          onPress={() => onTabChange(tab.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  iconContainerActive: {
    backgroundColor: `${COLORS.primary}15`,
  },
  icon: {
    fontSize: 24,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
});

export default BottomNav;
