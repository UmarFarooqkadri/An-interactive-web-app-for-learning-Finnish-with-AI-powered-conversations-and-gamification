import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { subscribeToOnlineUsers, sendMeetingInvite } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';

const OnlineUsers = ({ onClose, onInviteSent }) => {
  const { currentUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingInvite, setSendingInvite] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToOnlineUsers((users) => {
      // Filter out the current user from the list
      const filteredUsers = users.filter(user => user.userId !== currentUser?.uid);
      setOnlineUsers(filteredUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSendInvite = async (user) => {
    setSendingInvite(user.userId);
    try {
      const fromUserName = currentUser.displayName || currentUser.email.split('@')[0];
      const { inviteId, roomId } = await sendMeetingInvite(
        currentUser.uid,
        fromUserName,
        user.userId,
        user.displayName
      );

      // Call the callback to join the video call
      if (onInviteSent) {
        onInviteSent(roomId, user.displayName);
      }

      alert(`Practice invite sent to ${user.displayName}!`);
      onClose();
    } catch (error) {
      console.error('Error sending invite:', error);
      alert('Failed to send invite. Please try again.');
    } finally {
      setSendingInvite(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Practice Partners</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.onlineIndicator}>
        <View style={styles.greenDot} />
        <Text style={styles.onlineText}>
          {onlineUsers.length} {onlineUsers.length === 1 ? 'person' : 'people'} online
        </Text>
      </View>

      <ScrollView style={styles.userList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9B59B6" />
          </View>
        ) : onlineUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>👋</Text>
            <Text style={styles.emptyMessage}>Invite your friends or practice with AI</Text>
            <Text style={styles.emptySubtext}>Share the app with friends to practice together!</Text>
          </View>
        ) : (
          onlineUsers.map((user) => (
            <View key={user.userId} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </Text>
                  <View style={styles.onlineBadge} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.displayName}</Text>
                  <Text style={styles.userStatus}>Available to practice</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.inviteButton,
                  sendingInvite === user.userId && styles.inviteButtonDisabled
                ]}
                onPress={() => handleSendInvite(user)}
                disabled={sendingInvite === user.userId}
              >
                {sendingInvite === user.userId ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.inviteButtonText}>Invite to Practice</Text>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tip: Click "Invite to Practice" to start a video session
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#9B59B6',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2ECC71',
    marginRight: 8,
  },
  onlineText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  userList: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95A5A6',
  },
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498DB',
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 50,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  inviteButton: {
    backgroundColor: '#9B59B6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  inviteButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  inviteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 13,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});

export default OnlineUsers;
