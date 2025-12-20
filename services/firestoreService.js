import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  setDoc,
  onSnapshot,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Scenarios
export const addScenario = async (userId, scenarioData) => {
  try {
    const docRef = await addDoc(collection(db, 'scenarios'), {
      userId,
      title: scenarioData.title,
      description: scenarioData.description,
      icon: scenarioData.icon,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...scenarioData };
  } catch (error) {
    console.error('Error adding scenario:', error);
    throw error;
  }
};

export const getUserScenarios = async (userId) => {
  try {
    const q = query(collection(db, 'scenarios'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const scenarios = [];
    querySnapshot.forEach((doc) => {
      scenarios.push({ id: doc.id, ...doc.data() });
    });
    return scenarios;
  } catch (error) {
    console.error('Error getting scenarios:', error);
    throw error;
  }
};

export const deleteScenario = async (scenarioId) => {
  try {
    await deleteDoc(doc(db, 'scenarios', scenarioId));
  } catch (error) {
    console.error('Error deleting scenario:', error);
    throw error;
  }
};

// Wheel Topics
export const addWheelTopic = async (userId, topicData) => {
  try {
    const docRef = await addDoc(collection(db, 'wheelTopics'), {
      userId,
      label: topicData.label,
      color: topicData.color,
      content: topicData.content || [],
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...topicData };
  } catch (error) {
    console.error('Error adding wheel topic:', error);
    throw error;
  }
};

export const getUserWheelTopics = async (userId) => {
  try {
    const q = query(collection(db, 'wheelTopics'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const topics = [];
    querySnapshot.forEach((doc) => {
      topics.push({ id: doc.id, ...doc.data() });
    });
    return topics;
  } catch (error) {
    console.error('Error getting wheel topics:', error);
    throw error;
  }
};

export const deleteWheelTopic = async (topicId) => {
  try {
    await deleteDoc(doc(db, 'wheelTopics', topicId));
  } catch (error) {
    console.error('Error deleting wheel topic:', error);
    throw error;
  }
};

// User Presence
export const setUserOnline = async (userId, displayName, email) => {
  try {
    await setDoc(doc(db, 'presence', userId), {
      userId,
      displayName: displayName || email.split('@')[0],
      email,
      online: true,
      lastSeen: serverTimestamp()
    });
  } catch (error) {
    console.error('Error setting user online:', error);
    throw error;
  }
};

export const setUserOffline = async (userId) => {
  try {
    await updateDoc(doc(db, 'presence', userId), {
      online: false,
      lastSeen: serverTimestamp()
    });
  } catch (error) {
    console.error('Error setting user offline:', error);
  }
};

export const subscribeToOnlineUsers = (callback) => {
  const q = query(collection(db, 'presence'), where('online', '==', true));
  return onSnapshot(q, (snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    callback(users);
  });
};

// Meeting Invites
export const sendMeetingInvite = async (fromUserId, fromUserName, toUserId, toUserName) => {
  try {
    const roomId = `practice-${Date.now()}`;
    const inviteRef = await addDoc(collection(db, 'meetingInvites'), {
      fromUserId,
      fromUserName,
      toUserId,
      toUserName,
      status: 'pending',
      roomId,
      createdAt: serverTimestamp()
    });
    return { inviteId: inviteRef.id, roomId };
  } catch (error) {
    console.error('Error sending invite:', error);
    throw error;
  }
};

export const subscribeToInvites = (userId, callback) => {
  const q = query(
    collection(db, 'meetingInvites'),
    where('toUserId', '==', userId),
    where('status', '==', 'pending')
  );
  return onSnapshot(q, (snapshot) => {
    const invites = [];
    snapshot.forEach((doc) => {
      invites.push({ id: doc.id, ...doc.data() });
    });
    callback(invites);
  });
};

export const updateInviteStatus = async (inviteId, status) => {
  try {
    await updateDoc(doc(db, 'meetingInvites', inviteId), {
      status,
      respondedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating invite:', error);
    throw error;
  }
};

export const getInvite = async (inviteId) => {
  try {
    const inviteDoc = await getDoc(doc(db, 'meetingInvites', inviteId));
    if (inviteDoc.exists()) {
      return { id: inviteDoc.id, ...inviteDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting invite:', error);
    throw error;
  }
};

// User Stats and Progress Tracking
export const initializeUserStats = async (userId, displayName = null, email = null) => {
  try {
    const userStatsRef = doc(db, 'userStats', userId);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      await setDoc(userStatsRef, {
        displayName: displayName || email?.split('@')[0] || 'User',
        email: email,
        xp: 0,
        level: 1,
        streak: 0,
        longestStreak: 0,
        totalLessons: 0,
        totalMessages: 0,
        totalSpins: 0,
        totalVideoCalls: 0,
        lastLoginDate: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      });
    } else {
      // Update displayName and email if they're missing
      const stats = userStatsDoc.data();
      if (!stats.displayName || !stats.email) {
        await updateDoc(userStatsRef, {
          displayName: displayName || stats.displayName || email?.split('@')[0] || 'User',
          email: email || stats.email
        });
      }
    }
  } catch (error) {
    console.error('Error initializing user stats:', error);
    throw error;
  }
};

export const getUserStats = async (userId) => {
  try {
    const userStatsDoc = await getDoc(doc(db, 'userStats', userId));
    if (userStatsDoc.exists()) {
      return { id: userStatsDoc.id, ...userStatsDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

export const subscribeToUserStats = (userId, callback) => {
  return onSnapshot(doc(db, 'userStats', userId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

const calculateLevel = (xp) => {
  return Math.floor(xp / 200) + 1;
};

export const updateUserActivity = async (userId) => {
  try {
    const userStatsRef = doc(db, 'userStats', userId);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      await initializeUserStats(userId);
      return;
    }

    const stats = userStatsDoc.data();
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = stats.lastLoginDate;

    if (lastLogin === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = stats.streak || 0;

    if (lastLogin === yesterdayStr) {
      newStreak = newStreak + 1;
    } else {
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, stats.longestStreak || 0);

    const dailyXP = 25;
    const newXP = (stats.xp || 0) + dailyXP;
    const newLevel = calculateLevel(newXP);

    await updateDoc(userStatsRef, {
      streak: newStreak,
      longestStreak: longestStreak,
      lastLoginDate: today,
      xp: newXP,
      level: newLevel
    });
  } catch (error) {
    console.error('Error updating user activity:', error);
    throw error;
  }
};

export const addXP = async (userId, amount, activityType = 'general') => {
  try {
    const userStatsRef = doc(db, 'userStats', userId);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      await initializeUserStats(userId);
      return;
    }

    const stats = userStatsDoc.data();
    const newXP = (stats.xp || 0) + amount;
    const newLevel = calculateLevel(newXP);

    const updates = {
      xp: newXP,
      level: newLevel
    };

    if (activityType === 'message') {
      updates.totalMessages = (stats.totalMessages || 0) + 1;
    } else if (activityType === 'spin') {
      updates.totalSpins = (stats.totalSpins || 0) + 1;
    } else if (activityType === 'lesson') {
      updates.totalLessons = (stats.totalLessons || 0) + 1;
    } else if (activityType === 'videoCall') {
      updates.totalVideoCalls = (stats.totalVideoCalls || 0) + 1;
    }

    await updateDoc(userStatsRef, updates);
  } catch (error) {
    console.error('Error adding XP:', error);
    throw error;
  }
};

export const getLeaderboard = async (limit = 10) => {
  try {
    const q = query(
      collection(db, 'userStats'),
      where('xp', '>', 0)
    );
    const querySnapshot = await getDocs(q);

    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });

    leaderboard.sort((a, b) => b.xp - a.xp);

    return leaderboard.slice(0, limit);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

// Vocabulary
export const addVocabulary = async (userId, vocabularyData) => {
  try {
    const docRef = await addDoc(collection(db, 'vocabulary'), {
      userId,
      category: vocabularyData.category,
      finnish: vocabularyData.finnish,
      english: vocabularyData.english,
      phonetic: vocabularyData.phonetic || '',
      example: vocabularyData.example || '',
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...vocabularyData };
  } catch (error) {
    console.error('Error adding vocabulary:', error);
    throw error;
  }
};

export const getUserVocabulary = async (userId) => {
  try {
    const q = query(collection(db, 'vocabulary'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const vocabulary = [];
    querySnapshot.forEach((doc) => {
      vocabulary.push({ id: doc.id, ...doc.data() });
    });
    return vocabulary;
  } catch (error) {
    console.error('Error getting vocabulary:', error);
    throw error;
  }
};

export const deleteVocabulary = async (vocabularyId) => {
  try {
    await deleteDoc(doc(db, 'vocabulary', vocabularyId));
  } catch (error) {
    console.error('Error deleting vocabulary:', error);
    throw error;
  }
};
