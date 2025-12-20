import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS, SPACING, FONTS } from '../constants/theme';

const WherebyMeet = ({ roomId, userName, onLeave }) => {
  // Use Whereby's free instant rooms
  // Format: https://subdomain.whereby.com/roomname
  // For free instant rooms, we can use a simple room ID
  const wherebyUrl = `https://whereby.com/${roomId}?displayName=${encodeURIComponent(userName)}&minimal&embed`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Practice Session</Text>
        <TouchableOpacity style={styles.leaveButton} onPress={onLeave}>
          <Text style={styles.leaveButtonText}>Leave Call</Text>
        </TouchableOpacity>
      </View>

      <iframe
        src={wherebyUrl}
        allow="camera; microphone; fullscreen; speaker; display-capture; compute-pressure"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: '#000',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  leaveButton: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  leaveButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
});

export default WherebyMeet;
