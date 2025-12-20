import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';

const AboutScreen = ({ onBack }) => {
  const openGitHub = () => {
    Linking.openURL('https://github.com/UmarFarooqkadri/An-interactive-web-app-for-learning-Finnish-with-AI-powered-conversations-and-gamification');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      {/* App Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.appIcon}>
          <Text style={styles.appIconText}>🇫🇮</Text>
        </View>
        <Text style={styles.appName}>Finnish Learning App</Text>
        <Text style={styles.version}>Version 1.0</Text>
      </View>

      {/* About Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.paragraph}>
          Hi! I'm Farooq, a Finnish language student currently on my own journey to learn Finnish.
          Like many language learners, I found traditional learning methods sometimes felt repetitive
          and lacked the interactive element that makes learning truly engaging.
        </Text>
        <Text style={styles.paragraph}>
          That's why I created this app - to make the Finnish learning process more fun, interactive,
          and accessible to everyone. I believe that when learning is enjoyable, it becomes easier to
          stay motivated and make real progress.
        </Text>
        <Text style={styles.paragraph}>
          This app combines AI-powered conversations, gamification, and social learning to create
          an experience that's not just educational, but genuinely fun. Whether you're a complete
          beginner or already have some Finnish under your belt, I hope this app helps you on your
          Finnish learning journey!
        </Text>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Makes Us Special</Text>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🤖</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>AI-Powered Learning</Text>
            <Text style={styles.featureText}>
              Practice real conversations with an intelligent AI tutor that provides instant feedback
              in Finnish with English translations.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🎮</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Gamification</Text>
            <Text style={styles.featureText}>
              Earn XP points, maintain daily streaks, level up, and compete on the leaderboard
              to stay motivated.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>👥</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Social Learning</Text>
            <Text style={styles.featureText}>
              Connect with other Finnish learners through video calls and practice together
              in real-time.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🎯</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Interactive Practice</Text>
            <Text style={styles.featureText}>
              Spin the fortune wheel for random topics, create custom scenarios, and use
              voice recognition for pronunciation practice.
            </Text>
          </View>
        </View>
      </View>

      {/* Technology Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Built With</Text>
        <View style={styles.techStack}>
          <View style={styles.techItem}>
            <Text style={styles.techText}>React Native (Expo)</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techText}>Firebase</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techText}>Groq AI</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techText}>Jitsi Meet</Text>
          </View>
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get In Touch</Text>
        <Text style={styles.paragraph}>
          Have suggestions, found a bug, or just want to say hi? I'd love to hear from you!
        </Text>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => Linking.openURL('mailto:farooqkadri@gmail.com')}
        >
          <Text style={styles.contactButtonText}>📧 farooqkadri@gmail.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactButton, styles.githubButton]}
          onPress={openGitHub}
        >
          <Text style={styles.contactButtonText}>💻 View on GitHub</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for Finnish learners worldwide</Text>
        <Text style={styles.footerSubtext}>© 2025 Farooq Kadri</Text>
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
  iconContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  appIconText: {
    fontSize: 48,
  },
  appName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  version: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  paragraph: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  featureText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  techItem: {
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  techText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.medium,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.small,
  },
  githubButton: {
    backgroundColor: COLORS.textPrimary,
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  footerSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
});

export default AboutScreen;
