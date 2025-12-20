// Daily.co API service for creating and managing video rooms

const DAILY_API_KEY = process.env.EXPO_PUBLIC_DAILY_API_KEY;
const DAILY_API_URL = 'https://api.daily.co/v1';

/**
 * Create a new Daily.co room for video calls
 * @param {string} roomName - Unique room name
 * @returns {Promise<Object>} Room data with URL
 */
export const createDailyRoom = async (roomName) => {
  try {
    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        privacy: 'public',
        properties: {
          enable_prejoin_ui: false,
          enable_screenshare: true,
          enable_chat: true,
          start_video_off: false,
          start_audio_off: false,
          max_participants: 2,
          eject_at_room_exp: true,
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Daily.co API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      roomUrl: data.url,
      roomName: data.name,
    };
  } catch (error) {
    console.error('Error creating Daily room:', error);
    throw error;
  }
};

/**
 * Delete a Daily.co room
 * @param {string} roomName - Room name to delete
 * @returns {Promise<void>}
 */
export const deleteDailyRoom = async (roomName) => {
  try {
    const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Daily.co API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting Daily room:', error);
    // Don't throw - room cleanup is not critical
  }
};

/**
 * Get room information
 * @param {string} roomName - Room name
 * @returns {Promise<Object>} Room data
 */
export const getDailyRoom = async (roomName) => {
  try {
    const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Daily.co API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting Daily room:', error);
    throw error;
  }
};
