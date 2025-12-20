import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';

const PodcastScreen = ({ onBack }) => {
  // Spotify podcast embed URL
  const spotifyEmbedUrl = 'https://open.spotify.com/embed/show/0Jw48G4H84H8P468Gx3FPT?utm_source=generator&theme=0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finnish Podcast</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Intro Section */}
      <View style={styles.introCard}>
        <Text style={styles.podcastIcon}>🎧</Text>
        <Text style={styles.introTitle}>Learn Finnish Through Podcasts</Text>
        <Text style={styles.introText}>
          Listen to authentic Finnish conversations and improve your listening comprehension.
          Perfect for learning on the go!
        </Text>
      </View>

      {/* Spotify Player Card */}
      <View style={styles.playerCard}>
        <View style={styles.playerHeader}>
          <Text style={styles.playerTitle}>Featured Podcast</Text>
          <View style={styles.spotifyBadge}>
            <Text style={styles.spotifyText}>🎵 Spotify</Text>
          </View>
        </View>

        {Platform.OS === 'web' ? (
          <iframe
            style={styles.iframe}
            src={spotifyEmbedUrl}
            width="100%"
            height="500"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        ) : (
          <View style={styles.webOnlyMessage}>
            <Text style={styles.webOnlyIcon}>🌐</Text>
            <Text style={styles.webOnlyText}>
              Podcast player is available on web version only.
            </Text>
            <TouchableOpacity
              style={styles.openSpotifyButton}
              onPress={() => {
                // Open in Spotify app or browser
                const url = 'https://open.spotify.com/show/0Jw48G4H84H8P468Gx3FPT';
                if (Platform.OS === 'ios' || Platform.OS === 'android') {
                  Linking.openURL(url);
                }
              }}
            >
              <Text style={styles.openSpotifyText}>Open in Spotify</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Learning Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Podcast Learning Tips</Text>

        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>1</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>Listen Multiple Times:</Text> Don't worry if you don't
              understand everything on the first listen. Repeat episodes to catch details.
            </Text>
          </View>
        </View>

        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>2</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>Take Notes:</Text> Write down new words or phrases you
              hear and look them up later.
            </Text>
          </View>
        </View>

        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>3</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>Practice Speaking:</Text> Try repeating what you hear
              out loud to improve your pronunciation.
            </Text>
          </View>
        </View>

        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>4</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>Use Subtitles:</Text> If available, turn on subtitles
              to connect spoken words with their written form.
            </Text>
          </View>
        </View>
      </View>

      {/* Benefits Section */}
      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>Why Learn with Podcasts?</Text>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>👂</Text>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Improve Listening Skills</Text>
            <Text style={styles.benefitText}>
              Train your ear to understand natural Finnish speech patterns
            </Text>
          </View>
        </View>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🗣️</Text>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Learn Pronunciation</Text>
            <Text style={styles.benefitText}>
              Hear how native speakers pronounce words and phrases
            </Text>
          </View>
        </View>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>📚</Text>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Expand Vocabulary</Text>
            <Text style={styles.benefitText}>
              Pick up new words and expressions in context
            </Text>
          </View>
        </View>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🏃</Text>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Learn On-the-Go</Text>
            <Text style={styles.benefitText}>
              Practice while commuting, exercising, or doing chores
            </Text>
          </View>
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
    paddingBottom: SPACING.xxl,
  },
  header: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  introCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  podcastIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  introTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  introText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  playerCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  playerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  spotifyBadge: {
    backgroundColor: '#1DB954',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
  },
  spotifyText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  iframe: {
    borderRadius: RADIUS.md,
    border: 'none',
  },
  webOnlyMessage: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  webOnlyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  webOnlyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  openSpotifyButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  openSpotifyText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  tipsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  tipsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    lineHeight: 28,
    marginRight: SPACING.md,
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  tipBold: {
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  benefitsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  benefitsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  benefitIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  benefitText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default PodcastScreen;
