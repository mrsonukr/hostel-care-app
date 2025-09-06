import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_API_BASE_URL = 'https://notification.mssonutech.workers.dev/api';

export interface DeviceRegistrationData {
  user_id: string;
  expo_token: string;
  device_id: string;
  device_type: 'ios' | 'android' | 'web';
}

export interface DeviceDeactivationData {
  user_id: string;
  device_id: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

/**
 * Get the device ID for the current device
 */
export const getDeviceId = async (): Promise<string> => {
  try {
    // Use device ID if available, otherwise generate a fallback
    if (Device.isDevice) {
      return Device.osInternalBuildId || Device.modelId || 'unknown-device';
    }
    return 'simulator-device';
  } catch (error) {
    console.error('Error getting device ID:', error);
    return 'unknown-device';
  }
};

/**
 * Get the device type based on the platform
 */
export const getDeviceType = (): 'ios' | 'android' | 'web' => {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
};

/**
 * Get the Expo push token for the current device
 */
export const getExpoPushToken = async (): Promise<string | null> => {
  try {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: '17aa193f-9963-4c42-b8e3-3c0e26613bb8',
    });

    return token.data;
  } catch (error) {
    console.error('Error getting Expo push token:', error);
    return null;
  }
};

/**
 * Register device with the notification API
 */
export const registerDevice = async (userId: string): Promise<ApiResponse> => {
  try {
    const [expoToken, deviceId] = await Promise.all([
      getExpoPushToken(),
      getDeviceId(),
    ]);

    if (!expoToken) {
      throw new Error('Failed to get Expo push token');
    }

    const deviceData: DeviceRegistrationData = {
      user_id: userId,
      expo_token: expoToken,
      device_id: deviceId,
      device_type: getDeviceType(),
    };

    const response = await fetch(`${NOTIFICATION_API_BASE_URL}/register-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 400) {
        throw new Error(data.message || 'Invalid device data provided');
      } else if (response.status === 409) {
        // Device already exists - this is not necessarily an error
        console.log('Device already registered, updating...');
        return {
          success: true,
          message: 'Device already registered',
          data: data,
        };
      }
      throw new Error(data.message || 'Failed to register device');
    }

    return data;
  } catch (error) {
    console.error('Error registering device:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Deactivate device from the notification API
 */
export const deactivateDevice = async (userId: string): Promise<ApiResponse> => {
  try {
    const deviceId = await getDeviceId();

    const deactivationData: DeviceDeactivationData = {
      user_id: userId,
      device_id: deviceId,
    };

    const response = await fetch(`${NOTIFICATION_API_BASE_URL}/deactivate-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deactivationData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle "No device found" error gracefully - this is expected on first login
      if (data.message && data.message.includes('No device found')) {
        console.log('No device found for user - this is normal for first-time users');
        return {
          success: true,
          message: 'No device found to deactivate',
        };
      }
      throw new Error(data.message || 'Failed to deactivate device');
    }

    return data;
  } catch (error) {
    console.error('Error deactivating device:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get user tokens from the notification API
 */
export const getUserTokens = async (userId: string): Promise<ApiResponse<string[]>> => {
  try {
    const response = await fetch(`${NOTIFICATION_API_BASE_URL}/user-tokens/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user tokens');
    }

    return data;
  } catch (error) {
    console.error('Error getting user tokens:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Check if notifications are enabled and request permissions
 */
export const checkNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

/**
 * Check and update token if needed
 */
export const checkAndUpdateToken = async (userId: string): Promise<void> => {
  try {
    const currentToken = await getExpoPushToken();
    if (!currentToken) {
      console.log('No token available for update check');
      return;
    }

    // Get stored token from AsyncStorage
    const storedToken = await AsyncStorage.getItem('expo_push_token');
    
    if (storedToken !== currentToken) {
      console.log('Token has changed, updating...');
      const result = await registerDevice(userId);
      if (result.success) {
        await AsyncStorage.setItem('expo_push_token', currentToken);
        console.log('Token updated successfully');
      } else {
        console.warn('Failed to update token:', result.error);
      }
    }
  } catch (error) {
    console.error('Error checking token update:', error);
  }
};

/**
 * Force update token (useful for manual refresh)
 */
export const forceUpdateToken = async (userId: string): Promise<boolean> => {
  try {
    console.log('Force updating token...');
    const result = await registerDevice(userId);
    if (result.success) {
      const token = await getExpoPushToken();
      if (token) {
        await AsyncStorage.setItem('expo_push_token', token);
      }
      console.log('Token force updated successfully');
      return true;
    } else {
      console.warn('Failed to force update token:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Error force updating token:', error);
    return false;
  }
};

/**
 * Setup notification handlers
 */
export const setupNotificationHandlers = () => {
  // Handle notifications received while app is foregrounded
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Handle notification responses (when user taps on notification)
  const notificationListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response received:', response);
    // Handle navigation based on notification data
  });

  // Handle notifications received while app is running
  const notificationReceivedListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });

  return () => {
    notificationListener.remove();
    notificationReceivedListener.remove();
  };
};
