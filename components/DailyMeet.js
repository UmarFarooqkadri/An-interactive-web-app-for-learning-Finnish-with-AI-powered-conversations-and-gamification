import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { createDailyRoom, deleteDailyRoom } from '../services/dailyService';

const DailyMeet = ({ roomId, userName, onLeave }) => {
  const [roomUrl, setRoomUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const setupRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create Daily.co room
        const { roomUrl } = await createDailyRoom(roomId);

        // Add user name as query parameter
        const urlWithName = `${roomUrl}?userName=${encodeURIComponent(userName)}`;
        setRoomUrl(urlWithName);
        setLoading(false);
      } catch (err) {
        console.error('Error setting up Daily room:', err);
        setError('Failed to create video room. Please try again.');
        setLoading(false);
      }
    };

    setupRoom();

    // Cleanup: Delete room when component unmounts
    return () => {
      deleteDailyRoom(roomId).catch(err => {
        console.error('Error cleaning up Daily room:', err);
      });
    };
  }, [roomId, userName]);

  const handleLeave = async () => {
    // Delete the room
    await deleteDailyRoom(roomId);
    onLeave();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Setting up video call...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.errorButton} onPress={onLeave}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Practice Session</Text>
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
          <Text style={styles.leaveButtonText}>Leave Call</Text>
        </TouchableOpacity>
      </View>

      <iframe
        ref={iframeRef}
        src={roomUrl}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
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
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.lg,
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.medium,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  errorText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  errorButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
});

export default DailyMeet;
