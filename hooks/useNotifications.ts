import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../utils/notificationService';
import { notificationApi } from '../utils/notificationApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationState {
  isEnabled: boolean;
  isDeviceRegistered: boolean;
  isLoading: boolean;
  userId: string | null;
}

export interface NotificationActions {
  initializeNotifications: () => Promise<void>;
  registerDevice: (userId: string) => Promise<boolean>;
  deactivateDevice: (userId: string) => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
  sendTestNotification: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

export function useNotifications(): NotificationState & NotificationActions {
  const [state, setState] = useState<NotificationState>({
    isEnabled: false,
    isDeviceRegistered: false,
    isLoading: true,
    userId: null,
  });

  const loadUserId = useCallback(async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (studentData) {
        const student = JSON.parse(studentData);
        // Use roll_no as user identifier since that's what we have
        return student.roll_no;
      }
      return null;
    } catch (error) {
      console.error('Error loading user ID:', error);
      return null;
    }
  }, []);

  const checkNotificationStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const userId = await loadUserId();

      
      const isEnabled = await notificationService.areNotificationsEnabled();
      
      
      let isDeviceRegistered = false;
      if (userId && isEnabled) {
        try {
          const response = await notificationApi.getUserTokens(userId);
  
          isDeviceRegistered = response.success && response.tokens && response.tokens.length > 0;
        } catch (error) {
          console.error('Error checking device registration:', error);
          isDeviceRegistered = false;
        }
      }

      

      setState({
        isEnabled,
        isDeviceRegistered,
        isLoading: false,
        userId,
      });
    } catch (error) {
      console.error('Error checking notification status:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [loadUserId]);

  const registerDevice = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const success = await notificationService.registerDevice(userId);
      if (success) {
        setState(prev => ({ ...prev, isDeviceRegistered: true }));
      }
      return success;
    } catch (error) {
      console.error('Error registering device:', error);
      return false;
    }
  }, []);

  const deactivateDevice = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const success = await notificationService.deactivateDevice(userId);
      if (success) {
        setState(prev => ({ ...prev, isDeviceRegistered: false }));
      }
      return success;
    } catch (error) {
      console.error('Error deactivating device:', error);
      return false;
    }
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        setState(prev => ({ ...prev, isEnabled: true }));
      }
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }, []);

  const sendTestNotification = useCallback(async () => {
    try {
      await notificationService.sendLocalNotification(
        'Test Notification',
        'This is a test notification from HostelCare app!'
      );
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    await checkNotificationStatus();
  }, [checkNotificationStatus]);

  // Check status on mount
  useEffect(() => {
    checkNotificationStatus();
  }, [checkNotificationStatus]);

  return {
    ...state,
    registerDevice,
    deactivateDevice,
    requestPermissions,
    sendTestNotification,
    refreshStatus,
  };
}
