import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';
import { VOCABULARY_CATEGORIES } from '../data/vocabularyData';
import VocabularyPractice from './VocabularyPractice';

const VocabularySection = ({ customVocabulary, onAddVocabulary, onDeleteVocabulary, currentUser }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [practiceMode, setPracticeMode] = useState(null); // 'speaking' or 'writing'

  const handleCategorySelect = (categoryKey) => {
    setSelectedCategory(categoryKey);
  };

  const handlePracticeModeSelect = (mode) => {
    setPracticeMode(mode);
  };

  const handleClosePractice = () => {
    setSelectedCategory(null);
    setPracticeMode(null);
  };

  // Group custom vocabulary by category
  const customVocabByCategory = {};
  if (customVocabulary) {
    customVocabulary.forEach(vocab => {
      const cat = vocab.category || 'Custom';
      if (!customVocabByCategory[cat]) {
        customVocabByCategory[cat] = [];
      }
      customVocabByCategory[cat].push(vocab);
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a category</Text>
        <TouchableOpacity onPress={onAddVocabulary} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Default Categories */}
        {Object.keys(VOCABULARY_CATEGORIES).map((categoryKey) => {
          const category = VOCABULARY_CATEGORIES[categoryKey];
          return (
            <TouchableOpacity
              key={categoryKey}
              style={[styles.card, { backgroundColor: category.color }]}
              onPress={() => handleCategorySelect(categoryKey)}
            >
              <Text style={styles.cardIcon}>{category.icon}</Text>
              <Text style={styles.cardTitle}>{category.name}</Text>
              <Text style={styles.cardCount}>{category.words.length} words</Text>
            </TouchableOpacity>
          );
        })}

        {/* Custom Vocabulary Categories */}
        {Object.keys(customVocabByCategory).map((categoryName) => (
          <TouchableOpacity
            key={categoryName}
            style={[styles.card, { backgroundColor: '#E8DAEF' }]}
            onPress={() => handleCategorySelect(categoryName)}
          >
            <Text style={styles.cardIcon}>📝</Text>
            <Text style={styles.cardTitle}>{categoryName}</Text>
            <Text style={styles.cardCount}>
              {customVocabByCategory[categoryName].length} words
            </Text>
            <Text style={styles.customBadge}>Custom</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Practice Mode Selection Modal */}
      {selectedCategory && !practiceMode && (
        <Modal visible={true} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Practice Mode</Text>
              <Text style={styles.modalSubtitle}>
                {VOCABULARY_CATEGORIES[selectedCategory]?.name || selectedCategory}
              </Text>

              <TouchableOpacity
                style={[styles.modeButton, { backgroundColor: COLORS.primary }]}
                onPress={() => handlePracticeModeSelect('speaking')}
              >
                <Text style={styles.modeIcon}>🎤</Text>
                <View style={styles.modeInfo}>
                  <Text style={styles.modeTitle}>Speaking Practice</Text>
                  <Text style={styles.modeDescription}>
                    See the word and speak it out loud
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeButton, { backgroundColor: COLORS.secondary }]}
                onPress={() => handlePracticeModeSelect('writing')}
              >
                <Text style={styles.modeIcon}>✍️</Text>
                <View style={styles.modeInfo}>
                  <Text style={styles.modeTitle}>Writing Practice</Text>
                  <Text style={styles.modeDescription}>
                    See English and type the Finnish word
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Vocabulary Practice */}
      {selectedCategory && practiceMode && (
        <VocabularyPractice
          category={selectedCategory}
          mode={practiceMode}
          customVocabulary={customVocabByCategory[selectedCategory]}
          onClose={handleClosePractice}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  addButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  card: {
    width: 140,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  cardCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    opacity: 0.9,
  },
  customBadge: {
    marginTop: SPACING.xs,
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.large,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  modalSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  modeIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  modeDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  cancelButton: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
});

export default VocabularySection;
