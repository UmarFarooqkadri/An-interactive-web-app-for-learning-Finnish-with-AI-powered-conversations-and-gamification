import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';

const JitsiMeet = ({ roomId, userName, onLeave }) => {
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      console.error('Jitsi is only supported on web');
      return;
    }

    // Load Jitsi Meet API script
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => initJitsi();
    document.body.appendChild(script);

    const initJitsi = () => {
      if (jitsiContainerRef.current && window.JitsiMeetExternalAPI) {
        const domain = 'meet.jit.si';
        const options = {
          roomName: `LetsFinishThis_${roomId}`,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: userName
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            enableLobbyChat: false,
            autoKnockLobby: false,
            enableInsecureRoomNameWarning: false,
            requireDisplayName: false,
            disableInviteFunctions: true,
            disableLobbyPassword: true,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'chat',
              'settings',
              'videoquality',
              'filmstrip',
              'stats',
              'shortcuts',
              'tileview',
            ],
          },
        };

        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        // Automatically admit users from lobby
        jitsiApiRef.current.addEventListener('participantKickedOut', (participant) => {
          console.log('Participant in lobby:', participant);
        });

        jitsiApiRef.current.addEventListener('knockingParticipant', (participant) => {
          console.log('Someone is knocking:', participant);
          // Automatically admit the participant
          if (jitsiApiRef.current) {
            jitsiApiRef.current.executeCommand('answerKnockingParticipant', participant.id, true);
          }
        });

        // Event listener for when user leaves the call
        jitsiApiRef.current.addEventListener('readyToClose', () => {
          onLeave();
        });
      }
    };

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
      // Clean up script
      const scripts = document.querySelectorAll('script[src*="meet.jit.si"]');
      scripts.forEach(s => s.remove());
    };
  }, [roomId, userName, onLeave]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Practice Session with {userName}</Text>
        <TouchableOpacity
          style={styles.leaveButton}
          onPress={() => {
            if (jitsiApiRef.current) {
              jitsiApiRef.current.executeCommand('hangup');
            }
            onLeave();
          }}
        >
          <Text style={styles.leaveButtonText}>Leave Call</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.jitsiContainer} ref={jitsiContainerRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  leaveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  jitsiContainer: {
    flex: 1,
    width: '100%',
  },
});

export default JitsiMeet;
