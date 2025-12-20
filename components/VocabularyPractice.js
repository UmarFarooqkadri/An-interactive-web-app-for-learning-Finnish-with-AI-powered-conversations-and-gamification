import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';
import { VOCABULARY_CATEGORIES, getWordsByCategory } from '../data/vocabularyData';

const VocabularyPractice = ({ category, mode, customVocabulary, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);

  // Get words for this category
  const words = customVocabulary || getWordsByCategory(category);
  const currentWord = words[currentIndex];

  const handleNext = () => {
    setUserInput('');
    setIsCorrect(null);
    setShowFeedback(false);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Practice complete
      alert(`Practice complete! Score: ${score}/${words.length}`);
      onClose();
    }
  };

  const handleCheck = () => {
    if (mode === 'writing') {
      const correct = userInput.trim().toLowerCase() === currentWord.finnish.toLowerCase();
      setIsCorrect(correct);
      if (correct) {
        setScore(score + 1);
      }
      setShowFeedback(true);
    }
  };

  const handleSpeak = () => {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWord.finnish);
      utterance.lang = 'fi-FI';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMicPress = () => {
    if (Platform.OS !== 'web') {
      alert('Speech recognition is only available on web');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fi-FI';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setIsListening(false);

      const correct = transcript.includes(currentWord.finnish.toLowerCase());
      setIsCorrect(correct);
      if (correct) {
        setScore(score + 1);
      }
      setShowFeedback(true);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert('Speech recognition error. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!currentWord) {
    return null;
  }

  return (
    <Modal visible={true} animationType="slide">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'speaking' ? 'Speaking Practice' : 'Writing Practice'}
          </Text>
          <Text style={styles.progress}>
            {currentIndex + 1}/{words.length}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}/{words.length}</Text>
        </View>

        {/* Word Card */}
        <View style={styles.wordCard}>
          {mode === 'speaking' ? (
            <>
              <Text style={styles.label}>Finnish Word:</Text>
              <Text style={styles.finnishWord}>{currentWord.finnish}</Text>
              <Text style={styles.englishHint}>({currentWord.english})</Text>

              {currentWord.example && (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Example:</Text>
                  <Text style={styles.exampleText}>{currentWord.example}</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.speakButton}
                onPress={handleSpeak}
              >
                <Text style={styles.speakButtonIcon}>🔊</Text>
                <Text style={styles.speakButtonText}>Hear Pronunciation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.micButton,
                  isListening && styles.micButtonActive
                ]}
                onPress={handleMicPress}
                disabled={isListening}
              >
                <Text style={styles.micIcon}>
                  {isListening ? '🎙️' : '🎤'}
                </Text>
                <Text style={styles.micText}>
                  {isListening ? 'Listening...' : 'Speak Now'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>Translate to Finnish:</Text>
              <Text style={styles.englishPrompt}>{currentWord.english}</Text>

              {currentWord.example && (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Example usage:</Text>
                  <Text style={styles.exampleText}>{currentWord.example}</Text>
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Type the Finnish word..."
                value={userInput}
                onChangeText={setUserInput}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={COLORS.textLight}
              />

              <TouchableOpacity
                style={[
                  styles.checkButton,
                  !userInput.trim() && styles.checkButtonDisabled
                ]}
                onPress={handleCheck}
                disabled={!userInput.trim()}
              >
                <Text style={styles.checkButtonText}>Check Answer</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Feedback */}
        {showFeedback && (
          <View style={[
            styles.feedbackCard,
            isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
          ]}>
            <Text style={styles.feedbackIcon}>
              {isCorrect ? '✅' : '❌'}
            </Text>
            <Text style={styles.feedbackText}>
              {isCorrect ? 'Correct!' : `Incorrect. The answer is: ${currentWord.finnish}`}
            </Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex < words.length - 1 ? 'Next Word →' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  progress: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
  scoreCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  scoreLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  scoreValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  wordCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  finnishWord: {
    fontSize: 36,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  englishHint: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  englishPrompt: {
    fontSize: 28,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  exampleBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    width: '100%',
    marginBottom: SPACING.lg,
  },
  exampleLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  exampleText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  speakButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  speakButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    width: '100%',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: COLORS.accentOrange,
  },
  micIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  micText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    borderWidth: 2,
    borderColor: COLORS.border,
    width: '100%',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  checkButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    width: '100%',
  },
  checkButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  checkButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
  feedbackCard: {
    margin: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  feedbackCorrect: {
    backgroundColor: '#D5F4E6',
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  feedbackIncorrect: {
    backgroundColor: '#FADBD8',
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  feedbackIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  feedbackText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontWeight: FONTS.weights.medium,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
});

export default VocabularyPractice;
