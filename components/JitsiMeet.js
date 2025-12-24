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

    // Load Jitsi Meet API script from Azure Jitsi server
    const script = document.createElement('script');
    script.src = 'https://lets-finnish-this.swedencentral.cloudapp.azure.com/external_api.js';
    script.async = true;
    script.onerror = (error) => {
      console.error('Failed to load Jitsi script:', error);
    };
    script.onload = () => {
      console.log('Jitsi script loaded successfully');
      // Small delay to ensure the container element is mounted
      setTimeout(initJitsi, 100);
    };
    document.body.appendChild(script);

    const initJitsi = () => {
      // Get the actual DOM element from the ref
      const containerElement = jitsiContainerRef.current;

      if (!containerElement) {
        console.error('Container element not found');
        return;
      }

      if (!window.JitsiMeetExternalAPI) {
        console.error('JitsiMeetExternalAPI not available');
        return;
      }

      console.log('Initializing Jitsi with container:', containerElement);

      // Use Azure Jitsi server with Let's Encrypt SSL
      const domain = 'lets-finnish-this.swedencentral.cloudapp.azure.com';
      // Use simple alphanumeric room name
      const simpleRoomId = roomId.replace(/[^a-zA-Z0-9]/g, '');

      const options = {
        roomName: simpleRoomId,
        width: '100%',
        height: '100%',
        parentNode: containerElement,
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
          enableUserRolesBasedOnToken: false,
          enableNoisyMicDetection: false,
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
    };

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
      // Clean up script
      const scripts = document.querySelectorAll('script[src*="lets-finnish-this.swedencentral.cloudapp.azure.com"]');
      scripts.forEach(s => s.remove());
    };
  }, [roomId, userName, onLeave]);

  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#000' }}>
        <div style={{
          backgroundColor: '#2C3E50',
          padding: '15px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#FFF', fontSize: '16px', fontWeight: 'bold' }}>
            Practice Session with {userName}
          </span>
          <button
            style={{
              backgroundColor: '#E74C3C',
              color: '#FFF',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={() => {
              if (jitsiApiRef.current) {
                jitsiApiRef.current.executeCommand('hangup');
              }
              onLeave();
            }}
          >
            Leave Call
          </button>
        </div>
        <div ref={jitsiContainerRef} style={{ flex: 1, width: '100%' }} />
      </div>
    );
  }

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
