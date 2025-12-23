# Development Status & Feature Log

**Project:** Let's Finnish This - Finnish Learning App
**Repository:** An-interactive-web-app-for-learning-Finnish-with-AI-powered-conversations-and-gamification
**Live App:** https://an-interactive-web-app-for-learning.vercel.app/

---

## December 23, 2025

### 🎙️ Google Cloud Text-to-Speech with Multi-Voice Quota Management
- ✅ Implemented intelligent voice rotation strategy (Best Quality First)
- ✅ Voice priority: Chirp 3 HD → Neural2 → WaveNet → Standard → Web Speech API
- ✅ Separate quota tracking for each voice type in localStorage
- ✅ **Total free tier: 7.2M characters/month** (8M with 90% safety buffer)
  - Chirp 3 HD: 900K characters
  - Neural2: 900K characters
  - WaveNet: 900K characters
  - Standard: 3.6M characters
- ✅ Automatic monthly quota reset
- ✅ Warning at ~80% usage per voice type
- ✅ Graceful fallback to Web Speech API when all quotas exhausted
- ✅ API key secured with domain restrictions
- ✅ Budget alerts configured (€5/month)
- ✅ Emergency kill switch (disable API in Google Cloud Console)
- ✅ Working on production with high-quality Finnish pronunciation
- 📄 Documentation: `TTS_SETUP.md`
- 📂 Service: `services/ttsService.js`

### 📊 Google Analytics Tracking (Fixed)
- ✅ Fixed: Script wasn't loading (Expo wasn't using web/index.html)
- ✅ Solution: Injected Google Analytics programmatically in App.js
- ✅ Real-time tracking working
- ✅ Collecting user data properly
- ✅ Measurement ID: G-JQE7HBVS7B
- 📍 Location: App.js (useEffect hook)

---

## December 22, 2025

### 📊 Google Analytics Initial Setup
- ✅ Added Google Analytics script to web/index.html
- ✅ Configured measurement ID
- ⚠️ Issue discovered: Expo not using custom HTML (fixed Dec 23)

### 👥 Online Presence Tracking Fix
- ✅ Fixed heartbeat mechanism for accurate online user tracking
- ✅ Users now properly show offline after inactivity
- ✅ Prevents "ghost users" showing online for days

### 🎥 Jitsi Meet Local Docker Setup
- ✅ Set up local Jitsi server for testing (localhost:8443)
- ✅ Configured HTTPS with self-signed certificates
- ✅ Fixed WebSocket connection issues
- ✅ Documented all setup steps and troubleshooting
- 📄 Documentation: `jitsi/jitsi.md`
- 🐳 Docker configuration: `jitsi/.env`

---

## December 20, 2025

### 🎥 Video Calling - Multiple Iterations
- ✅ Implemented Whereby for video calling
- ✅ Simplified Jitsi room names and disabled authentication
- ✅ Switched back to Jitsi Meet (free service)
- ✅ Integrated Daily.co for video calling
- ✅ Added automatic lobby admission for Jitsi
- ✅ Disabled Jitsi lobby and moderator requirements
- ✅ Fixed video call invitation flow for inviter
- 📂 Components: `components/JitsiMeet.js`, `components/DailyMeet.js`, `components/WherebyMeet.js`

### 📚 Vocabulary Practice Feature - Complete
- ✅ **300 Finnish words** with translations and examples
- ✅ Categories: Greetings, Numbers, Colors, Family, Food, Time, Weather, Transportation, Body Parts, Emotions, Actions, Places, Nature, Animals, Clothes
- ✅ **Speaking practice mode** with speech recognition
- ✅ **Writing practice mode** with text input
- ✅ Phonetic pronunciation guides (e.g., "Hei" → "HAY")
- ✅ Example sentences with translations
- ✅ Score tracking and progress feedback
- ✅ English translations for all examples
- ✅ Custom vocabulary addition (AddVocabularyModal)
- ✅ Firestore integration for user vocabulary
- 📂 Components: `components/VocabularyPractice.js`, `components/AddVocabularyModal.js`
- 📂 Data: `data/vocabularyData.js`

### 🎨 UI/UX Improvements
- ✅ Updated empty partners message to be more positive
- ✅ Moved leaderboard and partners buttons to top center
- ✅ Made Partners button always visible
- ✅ Renamed app to "Let's Finnish This"
- ✅ Added floating leaderboard button in top-right
- ✅ Replaced Leaderboard tab with Podcast tab
- ✅ Added floating partners button
- ✅ Moved pro tip to top of screen

### 🎧 Podcast Integration
- ✅ Added Podcast screen with Spotify embed
- ✅ Embedded "Learn Finnish with FinnishPod101" podcast
- ✅ Accessible from bottom navigation
- 📂 Component: `screens/PodcastScreen.js`

### 📄 Legal & Information Pages
- ✅ Added About page with app description
- ✅ Added Privacy Policy
- ✅ Updated contact to hide email from bots
- ✅ Removed "Built With" section

---

## December 12, 2025

### 🚀 Initial Launch
- ✅ **AI-Powered Finnish Tutor**
  - Integration with Groq AI (llama-3.1-8b-instant)
  - Conversation practice in Finnish with translations
  - Speech recognition for speaking practice
  - Text-to-Speech for pronunciation (Web Speech API)

- ✅ **Gamification System**
  - XP points and leveling system
  - Level-based progression (Beginner → Master)
  - Daily streak tracking
  - Achievement system
  - User stats dashboard
  - Leaderboard with top users

- ✅ **Practice Features**
  - Scenario-based conversations (Shopping, Restaurant, Travel, etc.)
  - Random topic wheel with 6 categories
  - Custom scenarios (user-created)
  - Custom wheel topics
  - AI chat with Finnish responses

- ✅ **Social Features**
  - Real-time online user presence
  - Partner practice invitations
  - Video call integration (Jitsi Meet)
  - User profiles with stats
  - Firebase Authentication

- ✅ **Core Technology Stack**
  - React Native with Expo
  - Firebase (Authentication, Firestore, Realtime Database)
  - Deployed on Vercel
  - Web-based (responsive design)

- ✅ **Navigation & UI**
  - Bottom tab navigation (Home, Practice, Profile)
  - Modern design with custom theme
  - Responsive layout
  - Loading states and animations

---

## Technical Architecture

### Frontend
- **Framework:** React Native (Expo SDK)
- **State Management:** React Hooks (useState, useEffect, useContext)
- **Styling:** StyleSheet (React Native)
- **Platform:** Web (with mobile support planned)

### Backend Services
- **Authentication:** Firebase Auth
- **Database:** Cloud Firestore
- **Real-time:** Firebase Realtime Database (presence)
- **AI:** Groq API (llama-3.1-8b-instant)
- **TTS:** Google Cloud Text-to-Speech API + Web Speech API fallback
- **Analytics:** Google Analytics 4
- **Video:** Jitsi Meet (self-hosted option available)

### Deployment
- **Hosting:** Vercel
- **CI/CD:** Automatic deployment on git push
- **Domain:** an-interactive-web-app-for-learning.vercel.app

### Development Tools
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Environment:** Node.js

---

## Key Files & Structure

```
fortune-wheel/
├── App.js                          # Main app component with navigation
├── services/
│   ├── ttsService.js              # TTS with multi-voice rotation
│   └── firestoreService.js        # Firebase/Firestore operations
├── screens/
│   ├── HomeScreen.js              # AI chat & gamification
│   ├── PracticeScreen.js          # Scenarios & wheel
│   ├── ProfileScreen.js           # User stats & settings
│   ├── LeaderboardScreen.js       # Top users
│   └── PodcastScreen.js           # Finnish learning podcast
├── components/
│   ├── VocabularyPractice.js      # Vocab practice modes
│   ├── JitsiMeet.js               # Video calling
│   ├── OnlineUsers.js             # Partner list
│   └── [various modals]           # Add scenarios, topics, vocab
├── data/
│   └── vocabularyData.js          # 300 Finnish words
├── contexts/
│   └── AuthContext.js             # Authentication state
├── constants/
│   └── theme.js                   # Design system
├── jitsi/                         # Local Jitsi setup
│   ├── jitsi.md                   # Documentation
│   └── .env                       # Docker config
├── TTS_SETUP.md                   # TTS setup guide
└── dev_status.md                  # This file!
```

---

## Environment Variables

### Required (Production)
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` (for Google Analytics)
- `EXPO_PUBLIC_GROQ_API_KEY` (for AI chat)
- `EXPO_PUBLIC_GOOGLE_TTS_API_KEY` (for high-quality TTS)

### Optional
- `EXPO_PUBLIC_DAILY_API_KEY` (if using Daily.co)

---

## Current Status

### ✅ Production Ready
- AI Chat & Conversation Practice
- Vocabulary Practice (300 words)
- Gamification System
- User Profiles & Stats
- Online Presence & Partner Practice
- Video Calling (Jitsi Meet)
- Google Cloud TTS (multi-voice)
- Google Analytics Tracking
- Podcast Integration

### 🚧 In Progress
- Mobile app version (iOS/Android)
- More vocabulary categories
- Grammar lessons
- Pronunciation scoring

### 💡 Planned Features
- Push notifications for practice reminders
- Offline mode
- Progress charts & analytics
- Custom learning paths
- Certificate of completion
- Community features (forums, groups)

---

## Performance Metrics

### TTS Usage (Dec 23, 2025)
- **Chirp 3 HD Voice:** 107/900,000 characters (0.01%)
- **Total Free Tier:** 7.2M characters/month remaining
- **Cost to Date:** €0.00

### Google Analytics (Real-time)
- Active users being tracked
- Page views recorded
- User engagement monitored

---

## Known Issues & Limitations

### Resolved
- ✅ Google Analytics not loading (Fixed: Injected programmatically)
- ✅ TTS API key not loading in deployment (Fixed: Fresh build triggered)
- ✅ Users showing online for days (Fixed: Heartbeat mechanism)
- ✅ Jitsi WebSocket connection errors (Fixed: PUBLIC_URL config)

### Active
- None currently

---

## Resources & Documentation

- **Main Docs:** `README.md` (if exists)
- **TTS Setup:** `TTS_SETUP.md`
- **Jitsi Setup:** `jitsi/jitsi.md`
- **Live App:** https://an-interactive-web-app-for-learning.vercel.app/
- **Repository:** GitHub (private)

---

**Last Updated:** December 23, 2025
**Status:** ✅ Production - Stable & Feature-Complete
