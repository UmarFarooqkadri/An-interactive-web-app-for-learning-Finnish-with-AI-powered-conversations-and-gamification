import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Modal, Platform } from 'react-native';
import { useAuth } from './contexts/AuthContext';
import {
  addScenario,
  getUserScenarios,
  deleteScenario,
  addWheelTopic,
  getUserWheelTopics,
  deleteWheelTopic,
  addVocabulary,
  getUserVocabulary,
  deleteVocabulary,
  setUserOnline,
  setUserOffline,
  updateHeartbeat,
  subscribeToInvites,
  updateInviteStatus,
  initializeUserStats,
  updateUserActivity,
  subscribeToUserStats,
  addXP,
  getUserStats,
} from './services/firestoreService';
import { speakFinnish, getTTSUsageStats, stopSpeaking } from './services/ttsService';

// Components
import BottomNav from './components/BottomNav';
import AuthModal from './components/AuthModal';
import AddScenarioModal from './components/AddScenarioModal';
import AddWheelTopicModal from './components/AddWheelTopicModal';
import AddVocabularyModal from './components/AddVocabularyModal';
import OnlineUsers from './components/OnlineUsers';
import InviteNotification from './components/InviteNotification';
import JitsiMeet from './components/JitsiMeet';
import DailyMeet from './components/DailyMeet';
import WherebyMeet from './components/WherebyMeet';
import FloatingPartnersButton from './components/FloatingPartnersButton';
import FloatingLeaderboardButton from './components/FloatingLeaderboardButton';

// Screens
import HomeScreen from './screens/HomeScreen';
import PracticeScreen from './screens/PracticeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import PodcastScreen from './screens/PodcastScreen';

// Theme
import { COLORS } from './constants/theme';

// Helper functions
const getSpeechRecognition = () => {
  if (Platform.OS === 'web') {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }
  return null;
};

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

const chatWithAI = async (userMessage, conversationHistory) => {
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a friendly Finnish language teacher. Respond in Finnish first, then provide the English translation below in parentheses. Format: "Finnish text (English translation)". Keep responses short (1-3 sentences).'
      },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    return 'Anteeksi, en voinut vastata. (Sorry, I could not respond.)';
  }
};

const DEFAULT_WHEEL_SEGMENTS = [
  { label: 'Numbers', color: '#FF6B6B' },
  { label: 'Weekdays', color: '#4ECDC4' },
  { label: 'Directions', color: '#45B7D1' },
  { label: 'Greetings', color: '#96CEB4' },
  { label: 'Cities', color: '#FFEAA7' },
  { label: 'Introduction', color: '#DDA0DD' },
];

export default function App() {
  const { currentUser, logout } = useAuth();

  // Initialize Google Analytics on web
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Only run on web platform
      const GA_MEASUREMENT_ID = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;

      if (GA_MEASUREMENT_ID && !window.gtag) {
        // Load gtag.js script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script1);

        // Initialize gtag
        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `;
        document.head.appendChild(script2);

        console.log('Google Analytics initialized:', GA_MEASUREMENT_ID);
      }
    }
  }, []);

  // Navigation with URL hash support
  const [activeTab, setActiveTab] = useState(() => {
    // Check URL hash on initial load (e.g., #podcasts)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'podcasts' || hash === 'podcast') return 'podcast';
      if (hash === 'practice') return 'practice';
      if (hash === 'profile') return 'profile';
    }
    return 'home';
  });

  // Update URL hash when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const hashMap = {
        'home': '',
        'practice': 'practice',
        'podcast': 'podcasts',
        'profile': 'profile'
      };
      window.location.hash = hashMap[tab] || '';
    }
  };

  // Modals
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [addScenarioModalVisible, setAddScenarioModalVisible] = useState(false);
  const [addWheelTopicModalVisible, setAddWheelTopicModalVisible] = useState(false);
  const [addVocabularyModalVisible, setAddVocabularyModalVisible] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Data
  const [customScenarios, setCustomScenarios] = useState([]);
  const [customWheelTopics, setCustomWheelTopics] = useState([]);
  const [customVocabulary, setCustomVocabulary] = useState([]);
  const [userStats, setUserStats] = useState(null);

  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [speakText, setSpeakText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Video calls
  const [pendingInvite, setPendingInvite] = useState(null);
  const [inVideoCall, setInVideoCall] = useState(false);
  const [videoCallData, setVideoCallData] = useState(null);

  const recognitionRef = useRef(null);
  const allWheelSegments = [...DEFAULT_WHEEL_SEGMENTS, ...customWheelTopics];

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const [scenarios, topics, vocabulary] = await Promise.all([
            getUserScenarios(currentUser.uid),
            getUserWheelTopics(currentUser.uid),
            getUserVocabulary(currentUser.uid)
          ]);
          setCustomScenarios(scenarios);
          setCustomWheelTopics(topics);
          setCustomVocabulary(vocabulary);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setCustomScenarios([]);
        setCustomWheelTopics([]);
        setCustomVocabulary([]);
      }
    };

    loadUserData();
  }, [currentUser]);

  // Initialize and track user stats
  useEffect(() => {
    const setupUserStats = async () => {
      if (currentUser) {
        try {
          await initializeUserStats(
            currentUser.uid,
            currentUser.displayName,
            currentUser.email
          );
          await updateUserActivity(currentUser.uid);
        } catch (error) {
          console.error('Error setting up user stats:', error);
        }
      }
    };

    setupUserStats();
  }, [currentUser]);

  // Subscribe to user stats changes
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = subscribeToUserStats(currentUser.uid, (stats) => {
        setUserStats(stats);
      });

      return () => unsubscribe();
    } else {
      setUserStats(null);
    }
  }, [currentUser]);

  // Set user presence with heartbeat
  useEffect(() => {
    if (currentUser) {
      const displayName = currentUser.displayName || currentUser.email.split('@')[0];
      setUserOnline(currentUser.uid, displayName, currentUser.email);

      // Update heartbeat every 30 seconds to keep user online
      const heartbeatInterval = setInterval(() => {
        updateHeartbeat(currentUser.uid);
      }, 30000); // 30 seconds

      const handleBeforeUnload = () => {
        setUserOffline(currentUser.uid);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        clearInterval(heartbeatInterval);
        setUserOffline(currentUser.uid);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [currentUser]);

  // Subscribe to invites
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = subscribeToInvites(currentUser.uid, (invites) => {
        if (invites.length > 0) {
          setPendingInvite(invites[0]);
        } else {
          setPendingInvite(null);
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  // AI Chat functions
  const sendMessageToAI = async (message) => {
    if (!message.trim()) return;

    const userMsg = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMsg]);
    setSpeakText('');
    setIsChatLoading(true);

    const conversationHistory = [...chatMessages, userMsg];
    const aiResponse = await chatWithAI(message, conversationHistory);

    const aiMsg = { role: 'assistant', content: aiResponse };
    setChatMessages(prev => [...prev, aiMsg]);
    setIsChatLoading(false);

    const finnishOnly = aiResponse.replace(/\([^)]*\)/g, '').trim();

    // Speak with Google TTS (falls back to Web Speech if quota exceeded)
    const result = await speakFinnish(finnishOnly, {
      onQuotaExceeded: (stats) => {
        console.warn('TTS quota exceeded, using fallback voice', stats);
      }
    });

    if (!result.success) {
      console.error('TTS failed:', result.error);
    }

    if (currentUser) {
      await addXP(currentUser.uid, 10, 'message');
    }
  };

  const handleChatWithMic = () => {
    const SpeechRecognition = getSpeechRecognition();
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

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      await sendMessageToAI(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Scenario handlers
  const handleAddScenario = async (scenarioData) => {
    if (!currentUser) {
      alert('Please log in to add custom scenarios');
      return;
    }

    try {
      const newScenario = await addScenario(currentUser.uid, scenarioData);
      setCustomScenarios(prev => [...prev, newScenario]);
    } catch (error) {
      console.error('Error adding scenario:', error);
      alert('Failed to add scenario. Please try again.');
    }
  };

  const handleDeleteScenario = async (scenarioId) => {
    try {
      await deleteScenario(scenarioId);
      setCustomScenarios(prev => prev.filter(s => s.id !== scenarioId));
    } catch (error) {
      console.error('Error deleting scenario:', error);
      alert('Failed to delete scenario. Please try again.');
    }
  };

  // Wheel topic handlers
  const handleAddWheelTopic = async (topicData) => {
    if (!currentUser) {
      alert('Please log in to add custom wheel topics');
      return;
    }

    try {
      const newTopic = await addWheelTopic(currentUser.uid, topicData);
      setCustomWheelTopics(prev => [...prev, newTopic]);
    } catch (error) {
      console.error('Error adding wheel topic:', error);
      alert('Failed to add wheel topic. Please try again.');
    }
  };

  // Vocabulary handlers
  const handleAddVocabulary = async (vocabularyData) => {
    if (!currentUser) {
      alert('Please log in to add custom vocabulary');
      return;
    }

    try {
      const newVocabulary = await addVocabulary(currentUser.uid, vocabularyData);
      setCustomVocabulary(prev => [...prev, newVocabulary]);
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      alert('Failed to add vocabulary. Please try again.');
    }
  };

  const handleDeleteVocabulary = async (vocabularyId) => {
    try {
      await deleteVocabulary(vocabularyId);
      setCustomVocabulary(prev => prev.filter(v => v.id !== vocabularyId));
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      alert('Failed to delete vocabulary. Please try again.');
    }
  };

  // Invite handlers
  const handleAcceptInvite = async () => {
    if (!pendingInvite) return;

    try {
      await updateInviteStatus(pendingInvite.id, 'accepted');

      setVideoCallData({
        roomId: pendingInvite.roomId,
        partnerName: pendingInvite.fromUserName
      });
      setInVideoCall(true);
      setPendingInvite(null);
    } catch (error) {
      console.error('Error accepting invite:', error);
      alert('Failed to join call. Please try again.');
    }
  };

  const handleDeclineInvite = async () => {
    if (!pendingInvite) return;

    try {
      await updateInviteStatus(pendingInvite.id, 'declined');
      setPendingInvite(null);
    } catch (error) {
      console.error('Error declining invite:', error);
    }
  };

  const handleLeaveVideoCall = async () => {
    setInVideoCall(false);
    setVideoCallData(null);

    if (currentUser) {
      await addXP(currentUser.uid, 100, 'videoCall');
    }
  };

  const handleInviteSent = (roomId, partnerName) => {
    setVideoCallData({
      roomId,
      partnerName
    });
    setInVideoCall(true);
    setShowOnlineUsers(false);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  // Render active screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <PracticeScreen
            chatMessages={chatMessages}
            isChatLoading={isChatLoading}
            speakText={speakText}
            setSpeakText={setSpeakText}
            onSendMessage={sendMessageToAI}
            onMicPress={handleChatWithMic}
            isListening={isListening}
            customScenarios={customScenarios}
            currentUser={currentUser}
            onAddScenario={() => {
              if (currentUser) {
                setAddScenarioModalVisible(true);
              } else {
                setAuthModalVisible(true);
              }
            }}
            onDeleteScenario={handleDeleteScenario}
            onClearChat={clearChat}
            customVocabulary={customVocabulary}
            onAddVocabulary={() => {
              if (currentUser) {
                setAddVocabularyModalVisible(true);
              } else {
                setAuthModalVisible(true);
              }
            }}
            onDeleteVocabulary={handleDeleteVocabulary}
          />
        );
      case 'practice':
        return (
          <HomeScreen
            allWheelSegments={allWheelSegments}
            onSpinEnd={async () => {
              if (currentUser) {
                await addXP(currentUser.uid, 20, 'spin');
              }
            }}
            userStats={userStats}
          />
        );
      case 'podcast':
        return <PodcastScreen onBack={() => handleTabChange('home')} />;
      case 'profile':
        return (
          <ProfileScreen
            currentUser={currentUser}
            userStats={userStats}
            onLogin={() => setAuthModalVisible(true)}
            onLogout={logout}
            onCustomizeWheel={() => setAddWheelTopicModalVisible(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Main Screen */}
      {renderScreen()}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Floating Leaderboard Button */}
      <FloatingLeaderboardButton onPress={() => setShowLeaderboard(true)} />

      {/* Floating Partners Button */}
      <FloatingPartnersButton onPress={() => {
        if (currentUser) {
          setShowOnlineUsers(true);
        } else {
          setAuthModalVisible(true);
        }
      }} />

      {/* Online Users Modal */}
      {currentUser && showOnlineUsers && (
        <Modal visible={true} animationType="slide">
          <OnlineUsers
            currentUser={currentUser}
            onClose={() => setShowOnlineUsers(false)}
            onInviteSent={handleInviteSent}
          />
        </Modal>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Modal visible={true} animationType="slide">
          <LeaderboardScreen
            currentUser={currentUser}
            userStats={userStats}
            onClose={() => setShowLeaderboard(false)}
          />
        </Modal>
      )}

      {/* Modals */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />

      <AddScenarioModal
        visible={addScenarioModalVisible}
        onClose={() => setAddScenarioModalVisible(false)}
        onAdd={handleAddScenario}
      />

      <AddWheelTopicModal
        visible={addWheelTopicModalVisible}
        onClose={() => setAddWheelTopicModalVisible(false)}
        onAdd={handleAddWheelTopic}
      />

      <AddVocabularyModal
        visible={addVocabularyModalVisible}
        onClose={() => setAddVocabularyModalVisible(false)}
        onAdd={handleAddVocabulary}
      />

      {/* Invite Notification */}
      {pendingInvite && (
        <InviteNotification
          invite={pendingInvite}
          onAccept={handleAcceptInvite}
          onDecline={handleDeclineInvite}
        />
      )}

      {/* Video Call - Using local Jitsi server */}
      {inVideoCall && videoCallData && (
        <Modal visible={true} animationType="slide">
          <JitsiMeet
            roomId={videoCallData.roomId}
            userName={currentUser?.displayName || currentUser?.email.split('@')[0] || 'User'}
            onLeave={handleLeaveVideoCall}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  guestView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
