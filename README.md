# Finnish Learning App 🇫🇮

A modern, interactive web application for learning Finnish through AI-powered conversations, gamification, and social practice with other learners.

![App Screenshot](https://via.placeholder.com/800x400?text=Finnish+Learning+App)

## ✨ Features

- **AI-Powered Tutor**: Practice Finnish conversations with an intelligent AI that provides instant feedback
- **Interactive Fortune Wheel**: Randomize your learning topics for varied practice
- **Real-time Video Calls**: Connect with other learners for live practice sessions using Jitsi
- **Gamification**: Earn XP points, maintain streaks, and climb the leaderboard
- **Speech Recognition**: Practice pronunciation with voice input
- **Custom Scenarios**: Create personalized learning scenarios
- **Progress Tracking**: Track your XP, streaks, lessons, and achievements

## 🚀 Tech Stack

- **Frontend**: React Native (Expo) for web
- **Authentication**: Firebase Auth (Email/Password + Google Sign-In)
- **Database**: Firebase Firestore
- **AI**: Groq API (LLaMA 3.1 8B)
- **Video Calls**: Jitsi Meet
- **Speech**: Web Speech API

## 📦 Installation

### Prerequisites

- Node.js 16+ and npm
- Firebase account
- Groq API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/farooqkadri/finnish-learning-app.git
   cd finnish-learning-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your credentials:

   **Firebase Configuration:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or select existing
   - Go to Project Settings > General
   - Scroll to "Your apps" and click the web icon (</>)
   - Copy the config values to your `.env` file

   **Groq API Key:**
   - Go to [Groq Console](https://console.groq.com)
   - Sign up/Login and navigate to API Keys
   - Create a new API key
   - Copy it to `EXPO_PUBLIC_GROQ_API_KEY` in `.env`

4. **Configure Firebase**

   In Firebase Console:
   - Enable **Authentication** > Sign-in methods:
     - Email/Password
     - Google Sign-In
   - Create a **Firestore Database** in test mode
   - Add security rules (see below)

5. **Run the development server**
   ```bash
   npx expo start
   ```

   Press `w` to open in web browser.

## 🔒 Firebase Security Rules

Apply these security rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User stats - users can only read/write their own
    match /userStats/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Scenarios - users can read all, write their own
    match /scenarios/{scenarioId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Wheel topics - users can read all, write their own
    match /wheelTopics/{topicId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Presence - users can read all, write their own
    match /presence/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Meeting invites - users can read their own invites
    match /meetingInvites/{inviteId} {
      allow read: if request.auth != null &&
        (resource.data.toUserId == request.auth.uid ||
         resource.data.fromUserId == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        resource.data.toUserId == request.auth.uid;
    }
  }
}
```

## 🌐 Deploying to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/finnish-learning-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - **Framework Preset**: Other
     - **Build Command**: `npx expo export -p web`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Add Environment Variables**

   In Vercel dashboard > Project Settings > Environment Variables, add all variables from your `.env` file:
   - `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `EXPO_PUBLIC_FIREBASE_APP_ID`
   - `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `EXPO_PUBLIC_GROQ_API_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

   Follow the prompts and add environment variables when asked.

## 🎮 How to Use

1. **Sign Up/Login**: Create an account or login with Google
2. **Practice with AI**:
   - Go to Home tab
   - Choose a scenario or type your message
   - Practice conversations in Finnish
   - Earn 10 XP per message
3. **Spin the Wheel**:
   - Go to Practice tab
   - Tap SPIN to randomly select a topic
   - Earn 20 XP per spin
4. **Connect with Learners**:
   - Go to Partners tab (if you added it)
   - See who's online
   - Send practice invites
   - Have video conversations
   - Earn 100 XP per video call
5. **Track Progress**:
   - View Leaderboard to see your rank
   - Check Profile for your stats
   - Maintain daily streaks for bonus XP

## 📊 XP System

- **Daily Login**: 25 XP (automatic)
- **AI Chat Message**: 10 XP
- **Spin the Wheel**: 20 XP
- **Complete Scenario**: 50 XP
- **Video Practice Session**: 100 XP

## 🏆 Level System

- Every 200 XP = 1 Level
- Levels are displayed throughout the app

## 🔥 Streak System

- Login daily to maintain your streak
- Miss a day and your streak resets
- Longest streak is saved

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 👨‍💻 Author

**Farooq Kadri**
- Email: farooqkadri@gmail.com
- GitHub: [@farooqkadri](https://github.com/farooqkadri)

## 🙏 Acknowledgments

- Duolingo for UI/UX inspiration
- Groq for fast AI inference
- Firebase for backend infrastructure
- Jitsi for video conferencing

## 📞 Support

If you have questions or need help, please open an issue on GitHub.

---

Made with ❤️ for Finnish language learners worldwide
