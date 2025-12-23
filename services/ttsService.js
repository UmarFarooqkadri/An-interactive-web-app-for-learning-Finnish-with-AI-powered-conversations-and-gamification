/**
 * Text-to-Speech Service with Multi-Voice Quota Management
 *
 * Uses Google Cloud Text-to-Speech API with intelligent voice rotation
 *
 * Voice Rotation Strategy (Best Quality First):
 * 1. Chirp 3 HD (1M characters free) - Highest quality
 * 2. Neural2 (1M characters free) - Excellent quality
 * 3. WaveNet (1M characters free) - High quality
 * 4. Standard (4M characters free) - Good quality
 * 5. Web Speech API (unlimited) - Fallback
 *
 * Total free tier: 8 million characters/month
 * Safety buffer: 90% of each limit (prevents billing due to bugs)
 */

const GOOGLE_TTS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_TTS_API_KEY;

// Voice type configurations with 90% safety buffer
const VOICE_TYPES = {
  CHIRP3: {
    name: 'Chirp 3 HD',
    voiceName: 'fi-FI-Standard-A', // Will try Chirp3 if available, fallback to Standard
    limit: 1000000, // 1M characters free tier
    safeLimit: 900000, // 90% safety buffer
    storageKey: 'tts_chirp3_usage',
    requestsKey: 'tts_chirp3_requests',
    priority: 1
  },
  NEURAL2: {
    name: 'Neural2',
    voiceName: 'fi-FI-Standard-A', // Will try Neural2 if available, fallback to Standard
    limit: 1000000,
    safeLimit: 900000,
    storageKey: 'tts_neural2_usage',
    requestsKey: 'tts_neural2_requests',
    priority: 2
  },
  WAVENET: {
    name: 'WaveNet',
    voiceName: 'fi-FI-Wavenet-A',
    limit: 1000000,
    safeLimit: 900000,
    storageKey: 'tts_wavenet_usage',
    requestsKey: 'tts_wavenet_requests',
    priority: 3
  },
  STANDARD: {
    name: 'Standard',
    voiceName: 'fi-FI-Standard-A',
    limit: 4000000, // 4M characters free tier
    safeLimit: 3600000, // 90% safety buffer
    storageKey: 'tts_standard_usage',
    requestsKey: 'tts_standard_requests',
    priority: 4
  }
};

// Storage keys
const STORAGE_KEYS = {
  LAST_RESET: 'tts_last_reset',
  TOTAL_USAGE: 'tts_total_usage',
  TOTAL_REQUESTS: 'tts_total_requests'
};

/**
 * Get current month key (e.g., "2025-12")
 */
const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Load usage data for a specific voice type
 */
const loadVoiceUsage = (voiceType) => {
  try {
    const currentMonth = getCurrentMonthKey();
    const storedMonth = localStorage.getItem(STORAGE_KEYS.LAST_RESET);

    // Reset if new month
    if (storedMonth !== currentMonth) {
      return { usage: 0, requests: 0 };
    }

    const usage = parseInt(localStorage.getItem(voiceType.storageKey) || '0');
    const requests = parseInt(localStorage.getItem(voiceType.requestsKey) || '0');

    return { usage, requests };
  } catch (error) {
    console.error(`Error loading ${voiceType.name} usage:`, error);
    return { usage: 0, requests: 0 };
  }
};

/**
 * Save usage data for a specific voice type
 */
const saveVoiceUsage = (voiceType, usage, requests) => {
  try {
    const currentMonth = getCurrentMonthKey();
    localStorage.setItem(voiceType.storageKey, String(usage));
    localStorage.setItem(voiceType.requestsKey, String(requests));
    localStorage.setItem(STORAGE_KEYS.LAST_RESET, currentMonth);
  } catch (error) {
    console.error(`Error saving ${voiceType.name} usage:`, error);
  }
};

/**
 * Track character usage for a voice type
 */
const trackVoiceUsage = (voiceType, characterCount) => {
  const data = loadVoiceUsage(voiceType);
  const newUsage = data.usage + characterCount;
  const newRequests = data.requests + 1;

  saveVoiceUsage(voiceType, newUsage, newRequests);

  // Update total usage
  updateTotalUsage(characterCount);

  // Log warning if approaching limit
  const percentUsed = (newUsage / voiceType.limit) * 100;
  if (newUsage > voiceType.safeLimit * 0.89 && data.usage <= voiceType.safeLimit * 0.89) {
    console.warn(`TTS Warning: ${voiceType.name} at ${percentUsed.toFixed(1)}% of quota`);
  }

  return {
    usage: newUsage,
    requests: newRequests,
    remaining: voiceType.safeLimit - newUsage,
    percentUsed
  };
};

/**
 * Update total usage across all voice types
 */
const updateTotalUsage = (characterCount) => {
  try {
    const current = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_USAGE) || '0');
    const requests = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_REQUESTS) || '0');

    localStorage.setItem(STORAGE_KEYS.TOTAL_USAGE, String(current + characterCount));
    localStorage.setItem(STORAGE_KEYS.TOTAL_REQUESTS, String(requests + 1));
  } catch (error) {
    console.error('Error updating total usage:', error);
  }
};

/**
 * Check if a voice type is within quota
 */
const isVoiceWithinQuota = (voiceType) => {
  const data = loadVoiceUsage(voiceType);
  return data.usage < voiceType.safeLimit;
};

/**
 * Select the best available voice type based on quota
 */
const selectVoiceType = () => {
  // Try voice types in priority order
  const orderedTypes = Object.values(VOICE_TYPES).sort((a, b) => a.priority - b.priority);

  for (const voiceType of orderedTypes) {
    if (isVoiceWithinQuota(voiceType)) {
      const data = loadVoiceUsage(voiceType);
      const percentUsed = (data.usage / voiceType.limit) * 100;
      console.log(`TTS: Selected ${voiceType.name} voice (${percentUsed.toFixed(1)}% used)`);
      return voiceType;
    }
  }

  // All quotas exhausted
  console.warn('TTS: All Google TTS quotas exhausted, using Web Speech');
  return null;
};

/**
 * Reset monthly usage (called automatically when month changes)
 */
const resetMonthlyUsage = () => {
  const currentMonth = getCurrentMonthKey();

  // Reset all voice types
  Object.values(VOICE_TYPES).forEach(voiceType => {
    localStorage.setItem(voiceType.storageKey, '0');
    localStorage.setItem(voiceType.requestsKey, '0');
  });

  // Reset totals
  localStorage.setItem(STORAGE_KEYS.TOTAL_USAGE, '0');
  localStorage.setItem(STORAGE_KEYS.TOTAL_REQUESTS, '0');
  localStorage.setItem(STORAGE_KEYS.LAST_RESET, currentMonth);

  console.log(`TTS usage reset for new month: ${currentMonth}`);
};

/**
 * Check if month has changed and reset if needed
 */
const checkAndResetIfNewMonth = () => {
  const currentMonth = getCurrentMonthKey();
  const storedMonth = localStorage.getItem(STORAGE_KEYS.LAST_RESET);

  if (storedMonth !== currentMonth) {
    resetMonthlyUsage();
  }
};

/**
 * Get current usage statistics for all voice types
 */
export const getUsageStats = () => {
  checkAndResetIfNewMonth();

  const stats = {
    voiceTypes: {},
    total: {
      usage: parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_USAGE) || '0'),
      requests: parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_REQUESTS) || '0'),
      limit: 8000000, // Total free tier: 8M characters
      lastReset: localStorage.getItem(STORAGE_KEYS.LAST_RESET) || getCurrentMonthKey()
    }
  };

  // Add stats for each voice type
  Object.entries(VOICE_TYPES).forEach(([key, voiceType]) => {
    const data = loadVoiceUsage(voiceType);
    stats.voiceTypes[key] = {
      name: voiceType.name,
      usage: data.usage,
      requests: data.requests,
      limit: voiceType.limit,
      safeLimit: voiceType.safeLimit,
      remaining: voiceType.safeLimit - data.usage,
      percentUsed: (data.usage / voiceType.limit) * 100,
      withinQuota: data.usage < voiceType.safeLimit
    };
  });

  stats.total.remaining = stats.total.limit - stats.total.usage;
  stats.total.percentUsed = (stats.total.usage / stats.total.limit) * 100;

  return stats;
};

/**
 * Check if any voice type has quota remaining
 */
export const isWithinQuota = () => {
  checkAndResetIfNewMonth();
  return Object.values(VOICE_TYPES).some(voiceType => isVoiceWithinQuota(voiceType));
};

/**
 * Speak using Google Cloud Text-to-Speech API
 */
const speakWithGoogleTTS = async (text, voiceType, options = {}) => {
  if (!GOOGLE_TTS_API_KEY) {
    throw new Error('Google TTS API key not configured');
  }

  const {
    languageCode = 'fi-FI',
    speakingRate = 0.9,
    pitch = 0
  } = options;

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode,
            name: voiceType.voiceName,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate,
            pitch,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google TTS API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const audioContent = data.audioContent;

    // Track usage for this voice type
    const stats = trackVoiceUsage(voiceType, text.length);
    console.log(`TTS: ${voiceType.name} used ${text.length} chars. Voice total: ${stats.usage}/${voiceType.limit} (${stats.percentUsed.toFixed(1)}%)`);

    // Play audio
    const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
    await audio.play();

    return {
      success: true,
      method: 'google-tts',
      voiceType: voiceType.name,
      stats
    };
  } catch (error) {
    console.error(`Google TTS error (${voiceType.name}):`, error);
    throw error;
  }
};

/**
 * Speak using Web Speech API (fallback)
 */
const speakWithWebSpeech = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      reject(new Error('Web Speech API not supported'));
      return;
    }

    const {
      lang = 'fi-FI',
      rate = 0.9,
      pitch = 1,
      volume = 1
    } = options;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onend = () => {
        resolve({
          success: true,
          method: 'web-speech',
          voiceType: 'Browser TTS',
          stats: null
        });
      };

      utterance.onerror = (error) => {
        reject(new Error(`Web Speech error: ${error.error}`));
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Main TTS function with automatic voice rotation
 *
 * Priority:
 * 1. Chirp 3 HD (if within quota)
 * 2. Neural2 (if within quota)
 * 3. WaveNet (if within quota)
 * 4. Standard (if within quota)
 * 5. Web Speech API (fallback)
 */
export const speak = async (text, options = {}) => {
  if (!text || text.trim().length === 0) {
    console.warn('TTS: Empty text provided');
    return { success: false, error: 'Empty text' };
  }

  const {
    forceWebSpeech = false,
    onQuotaExceeded = null,
    ...voiceOptions
  } = options;

  try {
    // Force Web Speech API if requested
    if (forceWebSpeech) {
      console.log('TTS: Using Web Speech (forced)');
      return await speakWithWebSpeech(text, voiceOptions);
    }

    // Try Google TTS if API key is configured
    if (GOOGLE_TTS_API_KEY) {
      checkAndResetIfNewMonth();

      // Select best available voice type
      const voiceType = selectVoiceType();

      if (voiceType) {
        try {
          return await speakWithGoogleTTS(text, voiceType, voiceOptions);
        } catch (error) {
          console.warn(`TTS: ${voiceType.name} failed, falling back to Web Speech:`, error.message);
          return await speakWithWebSpeech(text, voiceOptions);
        }
      } else {
        // All quotas exhausted
        console.warn('TTS: All Google TTS quotas exhausted, using Web Speech');
        if (onQuotaExceeded) {
          onQuotaExceeded(getUsageStats());
        }
        return await speakWithWebSpeech(text, voiceOptions);
      }
    }

    // Fall back to Web Speech if no API key
    console.log('TTS: Using Web Speech (no API key)');
    return await speakWithWebSpeech(text, voiceOptions);

  } catch (error) {
    console.error('TTS: All methods failed:', error);
    return {
      success: false,
      error: error.message,
      method: 'none'
    };
  }
};

/**
 * Speak Finnish text (convenience function)
 */
export const speakFinnish = async (text, options = {}) => {
  return await speak(text, {
    languageCode: 'fi-FI',
    lang: 'fi-FI',
    rate: 0.9,
    ...options
  });
};

/**
 * Stop any ongoing speech
 */
export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Get available voices for Web Speech API
 */
export const getAvailableVoices = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  return window.speechSynthesis.getVoices();
};

/**
 * Get Finnish voices
 */
export const getFinnishVoices = () => {
  const voices = getAvailableVoices();
  return voices.filter(voice => voice.lang.startsWith('fi'));
};

// Export usage management functions
export {
  getUsageStats as getTTSUsageStats,
  resetMonthlyUsage as resetTTSUsage,
  isWithinQuota as isTTSWithinQuota
};
