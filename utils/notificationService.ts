import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationApi, DeviceRegistrationData, DeviceDeactivationData } from './notificationApi';
import { errorHandler } from './errorHandler';
import { EXPO_PUSH_CONFIG } from '../constants/expo';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationToken {
  expoToken: string;
  deviceId: string;
  deviceType: 'ios' | 'android' | 'web';
}

class NotificationService {
  private expoToken: string | null = null;
  private deviceId: string | null = null;
  private notificationListener: any = null;
  private responseListener: any = null;

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    try {
      // Check if device supports notifications
      if (!Device.isDevice) {
        console.log('⚠️ Running on simulator/emulator, notifications not available');
        return;
      }
      
      console.log('✅ Running on physical device, proceeding with notification setup');

      // Get device ID first
      this.deviceId = await this.getDeviceId();

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('⚠️ Notification permissions not granted, status:', finalStatus);
        return;
      }
      
      console.log('✅ Notification permissions granted');

      // Get Expo push token
      try {
        console.log('🔍 Attempting to get Expo push token with config:', EXPO_PUSH_CONFIG);
        
        const tokenData = await Notifications.getExpoPushTokenAsync(EXPO_PUSH_CONFIG);

        this.expoToken = tokenData.data;
        console.log('✅ Expo push token obtained successfully:', this.expoToken);

        // Save token to storage
        await this.saveTokenToStorage();
      } catch (tokenError: any) {
        console.error('❌ Error getting Expo push token:', tokenError);
        console.error('❌ Token error details:', {
          message: tokenError?.message || 'Unknown error',
          code: tokenError?.code || 'No code',
          stack: tokenError?.stack || 'No stack'
        });
        
        // Try alternative configuration for release builds
        try {
          console.log('🔄 Trying alternative token generation method...');
          const fallbackConfig = {
            projectId: EXPO_PUSH_CONFIG.projectId,
            experienceId: '@mrsonukr/hostelcare'
          };
          
          const fallbackTokenData = await Notifications.getExpoPushTokenAsync(fallbackConfig);
          this.expoToken = fallbackTokenData.data;
          console.log('✅ Fallback token obtained successfully:', this.expoToken);
          await this.saveTokenToStorage();
        } catch (fallbackError: any) {
          console.error('❌ Fallback token generation also failed:', fallbackError);
          console.error('❌ Fallback error details:', {
            message: fallbackError?.message || 'Unknown error',
            code: fallbackError?.code || 'No code'
          });
        }
      }

      // Set up notification listeners
      this.setupNotificationListeners();

    } catch (error) {
      console.error('Error initializing notifications:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Get unique device identifier
   */
  private async getDeviceId(): Promise<string> {
    try {
      const deviceId = await AsyncStorage.getItem('device_id');
      if (deviceId) {
        return deviceId;
      }

      // Generate a unique device ID
      const newDeviceId = `${Platform.OS}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('device_id', newDeviceId);
      return newDeviceId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return `unknown_${Date.now()}`;
    }
  }

  /**
   * Save notification token to storage
   */
  private async saveTokenToStorage(): Promise<void> {
    try {
      if (this.expoToken && this.deviceId) {
        const tokenData: NotificationToken = {
          expoToken: this.expoToken,
          deviceId: this.deviceId,
          deviceType: Platform.OS as 'ios' | 'android' | 'web',
        };
        await AsyncStorage.setItem('notification_token', JSON.stringify(tokenData));
      }
    } catch (error) {
      console.error('Error saving token to storage:', error);
    }
  }

  /**
   * Get notification token from storage
   */
  async getTokenFromStorage(): Promise<NotificationToken | null> {
    try {
      const tokenData = await AsyncStorage.getItem('notification_token');
      return tokenData ? JSON.parse(tokenData) : null;
    } catch (error) {
      console.error('Error getting token from storage:', error);
      return null;
    }
  }

  /**
   * Register device with notification API
   */
  async registerDevice(userId: string): Promise<boolean> {
    try {
      if (!this.expoToken || !this.deviceId) {
        return false;
      }

      // Validate data format
      if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return false;
      }

      const deviceData: DeviceRegistrationData = {
        user_id: userId.trim(),
        expo_token: this.expoToken,
        device_id: this.deviceId,
        device_type: Platform.OS as 'ios' | 'android' | 'web',
      };



      const response = await notificationApi.registerDevice(deviceData);
      
      if (response.success) {

        return true;
      } else {
        console.error('Device registration failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Error registering device:', error);
      // Don't use errorHandler here to avoid circular dependency
      return false;
    }
  }

  /**
   * Deactivate device on logout
   */
  async deactivateDevice(userId: string): Promise<boolean> {
    try {
      if (!this.deviceId) {
        return false;
      }

      const deviceData: DeviceDeactivationData = {
        user_id: userId,
        device_id: this.deviceId,
      };

      

      const response = await notificationApi.deactivateDevice(deviceData);
      
      if (response.success) {

        return true;
      } else {
        console.error('Device deactivation failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Error deactivating device:', error);
      // Don't use errorHandler here to avoid circular dependency
      return false;
    }
  }

  /**
   * Setup notification listeners
   */
  private setupNotificationListeners(): void {
    // Handle notification received while app is running
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {

      // Handle the notification as needed
    });

    // Handle notification response (user tapped notification)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {

      // Handle notification tap as needed
      // You can navigate to specific screens based on notification data
    });

    // Store listeners for cleanup (we'll handle cleanup differently)
    this.notificationListener = notificationListener;
    this.responseListener = responseListener;
  }

  /**
   * Send local notification (for testing)
   */
  async sendLocalNotification(title: string, body: string, data?: any): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  /**
   * Get current notification token
   */
  getCurrentToken(): string | null {
    console.log('🔍 Getting current token:', this.expoToken ? 'Available' : 'Not available');
    return this.expoToken;
  }

  /**
   * Get current device ID
   */
  getCurrentDeviceId(): string | null {
    console.log('🔍 Getting current device ID:', this.deviceId ? 'Available' : 'Not available');
    return this.deviceId;
  }

  /**
   * Check if notifications are enabled
   */
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export the class for testing purposes
export { NotificationService };
