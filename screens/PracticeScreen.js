import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';

const SCENARIOS = [
  {
    id: 'coffee',
    title: 'Ordering Coffee',
    icon: '☕',
    prompt: 'I want to practice ordering coffee in Finnish. Can you help me with a conversation at a café?',
  },
  {
    id: 'directions',
    title: 'Asking Directions',
    icon: '🗺️',
    prompt: 'I want to practice asking for directions in Finnish. Can you help me with a conversation about finding my way?',
  },
  {
    id: 'introduction',
    title: 'Introducing Yourself',
    icon: '👋',
    prompt: 'I want to practice introducing myself in Finnish. Can you help me with a conversation?',
  },
];

const PracticeScreen = ({
  chatMessages,
  isChatLoading,
  speakText,
  setSpeakText,
  onSendMessage,
  onMicPress,
  isListening,
  customScenarios,
  currentUser,
  onAddScenario,
  onDeleteScenario,
  onClearChat,
}) => {
  const getSuggestions = (messageCount) => {
    if (messageCount === 0) {
      return [
        { fi: 'Hei!', en: 'Hi!' },
        { fi: 'Mitä kuuluu?', en: 'How are you?' },
        { fi: 'Hyvää päivää', en: 'Good day' },
      ];
    } else if (messageCount <= 2) {
      return [
        { fi: 'Minulla menee hyvin', en: "I'm doing well" },
        { fi: 'Kiitos, entä sinulle?', en: 'Thanks, and you?' },
        { fi: 'Mitä sinä teet?', en: 'What are you doing?' },
      ];
    } else {
      return [
        { fi: 'Kerro lisää', en: 'Tell me more' },
        { fi: 'Kiitos avusta!', en: 'Thanks for the help!' },
        { fi: 'Näkemiin!', en: 'Goodbye!' },
      ];
    }
  };

  const allScenarios = [...SCENARIOS, ...customScenarios];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Tutor</Text>
          <Text style={styles.subtitle}>Practice Finnish conversation</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={onClearChat}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Scenarios (only show when chat is empty) */}
      {chatMessages.length === 0 && (
        <View style={styles.scenariosSection}>
          <View style={styles.scenariosHeader}>
            <Text style={styles.scenariosTitle}>Choose a scenario</Text>
            <TouchableOpacity onPress={onAddScenario} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scenariosScroll}
          >
            {allScenarios.map((scenario, index) => (
              <TouchableOpacity
                key={scenario.id || index}
                style={[
                  styles.scenarioCard,
                  index >= SCENARIOS.length && styles.customScenarioCard,
                ]}
                onPress={() => {
                  const prompt = scenario.prompt || `I want to practice: ${scenario.title}. ${scenario.description}`;
                  onSendMessage(prompt);
                }}
              >
                {index >= SCENARIOS.length && (
                  <TouchableOpacity
                    style={styles.deleteScenarioBtn}
                    onPress={() => onDeleteScenario(scenario.id)}
                  >
                    <Text style={styles.deleteScenarioText}>×</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.scenarioIcon}>{scenario.icon}</Text>
                <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Messages */}
      <ScrollView style={styles.messagesContainer}>
        {chatMessages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🤖</Text>
            <Text style={styles.emptyTitle}>Start practicing!</Text>
            <Text style={styles.emptyText}>
              Choose a scenario above or type a message below
            </Text>
          </View>
        )}

        {chatMessages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.role === 'user' && styles.userMessageText,
              ]}
            >
              {msg.content}
            </Text>
          </View>
        ))}

        {isChatLoading && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
      </ScrollView>

      {/* Suggestions */}
      {chatMessages.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsLabel}>Quick replies:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {getSuggestions(chatMessages.length).map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => onSendMessage(suggestion.fi)}
              >
                <Text style={styles.suggestionFinnish}>{suggestion.fi}</Text>
                <Text style={styles.suggestionEnglish}>({suggestion.en})</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPress={onMicPress}
        >
          <Text style={styles.micIcon}>{isListening ? '⏹️' : '🎤'}</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={speakText}
          onChangeText={setSpeakText}
          placeholder="Type your message..."
          placeholderTextColor={COLORS.textLight}
          onSubmitEditing={() => onSendMessage(speakText)}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => onSendMessage(speakText)}
          disabled={isChatLoading}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
  },
  clearButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
  },
  scenariosSection: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scenariosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  scenariosTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  scenariosScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  scenarioCard: {
    width: 120,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  customScenarioCard: {
    borderColor: COLORS.secondary,
    position: 'relative',
  },
  deleteScenarioBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.danger,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  deleteScenarioText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.weights.bold,
  },
  scenarioIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  scenarioTitle: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: SPACING.xs,
  },
  aiBubble: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: SPACING.xs,
    ...SHADOWS.small,
  },
  messageText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.white,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  suggestionsLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  suggestionsScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  suggestionChip: {
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  suggestionFinnish: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
  },
  suggestionEnglish: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: COLORS.danger,
  },
  micIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.lg,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  sendIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
});

export default PracticeScreen;
