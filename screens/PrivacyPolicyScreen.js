import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';

const PrivacyPolicyScreen = ({ onBack }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.section}>
        <Text style={styles.lastUpdated}>Last Updated: December 20, 2025</Text>

        <Text style={styles.intro}>
          Your privacy is important to us. This Privacy Policy explains how Let's Finnish this
          ("we", "our", or "us") collects, uses, and protects your personal information.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Account Information:</Text> When you create an account, we collect:
        </Text>
        <Text style={styles.bulletPoint}>• Email address</Text>
        <Text style={styles.bulletPoint}>• Display name (if provided)</Text>
        <Text style={styles.bulletPoint}>• Google account information (if you sign in with Google)</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Usage Data:</Text> We automatically collect:
        </Text>
        <Text style={styles.bulletPoint}>• Learning progress (XP points, levels, streaks)</Text>
        <Text style={styles.bulletPoint}>• Practice sessions and chat messages with the AI tutor</Text>
        <Text style={styles.bulletPoint}>• Custom scenarios and wheel topics you create</Text>
        <Text style={styles.bulletPoint}>• Meeting invites and video call participation</Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>We use your information to:</Text>
        <Text style={styles.bulletPoint}>• Provide and improve the Finnish learning experience</Text>
        <Text style={styles.bulletPoint}>• Track your learning progress and maintain streaks</Text>
        <Text style={styles.bulletPoint}>• Enable AI-powered Finnish conversation practice</Text>
        <Text style={styles.bulletPoint}>• Display leaderboards and rankings</Text>
        <Text style={styles.bulletPoint}>• Connect you with other learners for practice sessions</Text>
        <Text style={styles.bulletPoint}>• Send important app updates and notifications</Text>

        <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
        <Text style={styles.paragraph}>
          Your data is stored securely using Firebase, Google's cloud platform with enterprise-grade
          security. We implement the following security measures:
        </Text>
        <Text style={styles.bulletPoint}>• Encrypted data transmission (HTTPS/TLS)</Text>
        <Text style={styles.bulletPoint}>• Secure authentication with Firebase Auth</Text>
        <Text style={styles.bulletPoint}>• Firestore security rules to protect user data</Text>
        <Text style={styles.bulletPoint}>• Regular security updates and monitoring</Text>

        <Text style={styles.sectionTitle}>4. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          We use the following third-party services that may collect information:
        </Text>

        <Text style={styles.subTitle}>Firebase (Google)</Text>
        <Text style={styles.bulletPoint}>• Purpose: Authentication, database, and hosting</Text>
        <Text style={styles.bulletPoint}>
          • Privacy Policy: https://firebase.google.com/support/privacy
        </Text>

        <Text style={styles.subTitle}>Groq AI</Text>
        <Text style={styles.bulletPoint}>• Purpose: AI-powered Finnish conversation practice</Text>
        <Text style={styles.bulletPoint}>
          • Your chat messages are processed by Groq's AI to generate responses
        </Text>
        <Text style={styles.bulletPoint}>• Privacy Policy: https://groq.com/privacy-policy/</Text>

        <Text style={styles.subTitle}>Jitsi Meet</Text>
        <Text style={styles.bulletPoint}>
          • Purpose: Video calls for practice with other learners
        </Text>
        <Text style={styles.bulletPoint}>
          • Video calls are peer-to-peer when possible
        </Text>
        <Text style={styles.bulletPoint}>• Privacy Policy: https://jitsi.org/privacy/</Text>

        <Text style={styles.sectionTitle}>5. Data Sharing</Text>
        <Text style={styles.paragraph}>
          We do NOT sell your personal information to third parties. Your data is only shared:
        </Text>
        <Text style={styles.bulletPoint}>
          • With other users: Display name, XP, level, and streak on the leaderboard
        </Text>
        <Text style={styles.bulletPoint}>
          • With practice partners: Display name and online status (when using video calls)
        </Text>
        <Text style={styles.bulletPoint}>
          • With AI service: Chat messages for generating Finnish learning responses
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.paragraph}>You have the right to:</Text>
        <Text style={styles.bulletPoint}>• Access your personal data</Text>
        <Text style={styles.bulletPoint}>• Request deletion of your account and data</Text>
        <Text style={styles.bulletPoint}>• Update or correct your information</Text>
        <Text style={styles.bulletPoint}>• Opt-out of optional features</Text>
        <Text style={styles.bulletPoint}>• Export your data</Text>

        <Text style={styles.paragraph}>
          To exercise these rights, please contact us at farooqkadri@gmail.com
        </Text>

        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our app is intended for users aged 13 and above. We do not knowingly collect personal
          information from children under 13. If you believe we have collected information from a
          child under 13, please contact us immediately.
        </Text>

        <Text style={styles.sectionTitle}>8. Cookies and Tracking</Text>
        <Text style={styles.paragraph}>
          We use local storage and cookies to:
        </Text>
        <Text style={styles.bulletPoint}>• Keep you logged in</Text>
        <Text style={styles.bulletPoint}>• Remember your preferences</Text>
        <Text style={styles.bulletPoint}>• Maintain your session</Text>
        <Text style={styles.paragraph}>
          These are essential for the app to function and cannot be disabled.
        </Text>

        <Text style={styles.sectionTitle}>9. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your data for as long as your account is active. If you delete your account:
        </Text>
        <Text style={styles.bulletPoint}>
          • Your personal information will be deleted within 30 days
        </Text>
        <Text style={styles.bulletPoint}>
          • Your leaderboard entries may be anonymized rather than deleted
        </Text>
        <Text style={styles.bulletPoint}>
          • Backup data may be retained for up to 90 days for recovery purposes
        </Text>

        <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any significant
          changes by:
        </Text>
        <Text style={styles.bulletPoint}>• Posting the new policy on this page</Text>
        <Text style={styles.bulletPoint}>• Updating the "Last Updated" date</Text>
        <Text style={styles.bulletPoint}>
          • Sending an email notification (for major changes)
        </Text>

        <Text style={styles.sectionTitle}>11. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy or how we handle your data, please
          contact us:
        </Text>
        <Text style={styles.bulletPoint}>• Email: farooqkadri@gmail.com</Text>
        <Text style={styles.bulletPoint}>
          • GitHub: https://github.com/UmarFarooqkadri/An-interactive-web-app-for-learning-Finnish-with-AI-powered-conversations-and-gamification
        </Text>

        <Text style={styles.sectionTitle}>12. Legal Compliance</Text>
        <Text style={styles.paragraph}>
          This app complies with:
        </Text>
        <Text style={styles.bulletPoint}>• GDPR (General Data Protection Regulation)</Text>
        <Text style={styles.bulletPoint}>• CCPA (California Consumer Privacy Act)</Text>
        <Text style={styles.bulletPoint}>• Other applicable privacy laws</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using this app, you agree to this Privacy Policy.
          </Text>
          <Text style={styles.footerSubtext}>© 2025 Let's Finnish this</Text>
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
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  lastUpdated: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SPACING.lg,
  },
  intro: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  subTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  paragraph: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  bold: {
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  bulletPoint: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.md,
  },
  footer: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  footerSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
});

export default PrivacyPolicyScreen;
