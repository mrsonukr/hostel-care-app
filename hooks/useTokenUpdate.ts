import { useCallback } from 'react';
import { Alert } from 'react-native';
import { forceUpdateToken } from '../utils/notificationApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useTokenUpdate() {
  const updateToken = useCallback(async (): Promise<boolean> => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (!studentData) {
        Alert.alert('Error', 'Please log in first');
        return false;
      }

      const student = JSON.parse(studentData);
      const success = await forceUpdateToken(student.roll_no);
      
      if (success) {
        Alert.alert('Success', 'Push notification token updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update push notification token');
      }
      
      return success;
    } catch (error) {
      console.error('Error updating token:', error);
      Alert.alert('Error', 'Something went wrong while updating token');
      return false;
    }
  }, []);

  return {
    updateToken,
  };
}
