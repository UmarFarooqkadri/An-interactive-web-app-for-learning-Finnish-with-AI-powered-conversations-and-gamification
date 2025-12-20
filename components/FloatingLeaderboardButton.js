import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';

const FloatingLeaderboardButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.fabIcon}>🏆</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -65, // Half button width (60/2) + half gap (10/2) = -65
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
    zIndex: 1000,
    // Web-specific shadow for better visibility
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    }),
  },
  fabIcon: {
    fontSize: 28,
  },
});

export default FloatingLeaderboardButton;
