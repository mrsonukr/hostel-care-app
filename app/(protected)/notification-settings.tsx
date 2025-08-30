import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { notificationService } from '../../utils/notificationService';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../contexts/AuthContext';
import { testNotificationSystem, testDeviceRegistration } from '../../utils/testNotification';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { registerDeviceForNotifications } = useAuth();
  const [manualToggle, setManualToggle] = useState(false);
  const {
    isEnabled: notificationsEnabled,
    isDeviceRegistered: deviceRegistered,
    isLoading: loading,
    userId,
    registerDevice,
    requestPermissions,
    sendTestNotification,
    refreshStatus,
  } = useNotifications();

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // Update manual toggle when notifications status changes
  useEffect(() => {
    setManualToggle(notificationsEnabled);
  }, [notificationsEnabled]);

  const handleNotificationToggle = async (value: boolean) => {
    try {
  
      
      // Update manual toggle immediately for better UX
      setManualToggle(value);
      
      if (value) {
        // Request permissions
        const granted = await requestPermissions();
        if (granted) {
          // Register device if user ID is available
          if (userId) {
            await registerDevice(userId);
            Alert.alert('Success', 'Notifications enabled successfully!');
          }
        } else {
          Alert.alert(
            'Permission Denied',
            'Please enable notifications in your device settings to receive updates.'
          );
          // Revert manual toggle if permission denied
          setManualToggle(false);
          return;
        }
      } else {
        // When turning off, we need to manually update the state
        // since we can't actually disable system permissions
        Alert.alert(
          'Notifications Disabled',
          'You will no longer receive push notifications. You can re-enable them anytime.'
        );
      }
      
      // Refresh status to update the UI
      await refreshStatus();
      
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings.');
      // Revert manual toggle on error
      setManualToggle(!value);
      // Refresh status to ensure UI is in sync
      await refreshStatus();
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification.');
    }
  };

  const handleSystemTest = async () => {
    try {
      const result = await testNotificationSystem();
      if (result) {
        Alert.alert('Success', 'All notification system tests passed!');
      } else {
        Alert.alert('Error', 'Some tests failed. Check console for details.');
      }
    } catch (error) {
      console.error('Error in system test:', error);
      Alert.alert('Error', 'System test failed.');
    }
  };

  const handleRegistrationTest = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    try {
      const result = await testDeviceRegistration(userId);
      if (result) {
        Alert.alert('Success', 'Device registration test passed!');
      } else {
        Alert.alert('Error', 'Device registration test failed. Check console for details.');
      }
    } catch (error) {
      console.error('Error in registration test:', error);
      Alert.alert('Error', 'Registration test failed.');
    }
  };

  const handleHealthCheck = async () => {
    try {
      const { notificationApi } = require('../../utils/notificationApi');
      const result = await notificationApi.healthCheck();
      
      if (result.status === 'ok' || result.status === 'healthy') {
        Alert.alert('Success', `API is healthy: ${result.message}`);
      } else {
        Alert.alert('Warning', `API health issue: ${result.message}`);
      }
    } catch (error) {
      console.error('Error in health check:', error);
      Alert.alert('Error', 'Health check failed.');
    }
  };

  const handleReRegisterDevice = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    try {
      await registerDevice(userId);
      Alert.alert('Success', 'Device re-registered successfully!');
    } catch (error) {
      console.error('Error re-registering device:', error);
      Alert.alert('Error', 'Failed to re-register device.');
    }
  };

  const getDeviceInfo = () => {
    const token = notificationService.getCurrentToken();
    const deviceId = notificationService.getCurrentDeviceId();
    
    return {
      token: token || 'Not available',
      deviceId: deviceId || 'Not available',
    };
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-gray-600">Loading notification settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 pt-16 pb-8">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2447" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-[#0B2447]">Notification Settings</Text>
        </View>

        {/* Enable Notifications */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-[#0B2447] mb-1">
                Push Notifications
              </Text>
              <Text className="text-gray-600 text-sm">
                Receive notifications about complaints, updates, and important announcements
              </Text>
              {loading && (
                <Text className="text-blue-600 text-xs mt-1">
                  Checking notification status...
                </Text>
              )}
            </View>
            <View className="items-end">
              <Switch
                value={manualToggle}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#767577', true: '#0B2447' }}
                thumbColor={manualToggle ? '#ffffff' : '#f4f3f4'}
                disabled={loading}
              />
              <Text className="text-xs text-gray-500 mt-1">
                {manualToggle ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
        </View>

        {/* Device Registration Status */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-[#0B2447] mb-3">
            Device Registration Status
          </Text>
          
          <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons
              name={deviceRegistered ? 'check-circle' : 'alert-circle'}
              size={20}
              color={deviceRegistered ? '#10B981' : '#F59E0B'}
            />
            <Text className={`ml-2 font-medium ${deviceRegistered ? 'text-green-600' : 'text-yellow-600'}`}>
              {deviceRegistered ? 'Device Registered' : 'Device Not Registered'}
            </Text>
          </View>

          {!deviceRegistered && notificationsEnabled && (
            <TouchableOpacity
              onPress={handleReRegisterDevice}
              className="bg-[#0B2447] rounded-lg py-3 px-4 mt-2"
            >
              <Text className="text-white text-center font-semibold">
                Re-register Device
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Device Information */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-[#0B2447] mb-3">
            Device Information
          </Text>
          
          <View className="space-y-2">
            <View>
              <Text className="text-sm text-gray-600">Device ID:</Text>
              <Text className="text-sm font-mono text-[#0B2447]">{getDeviceInfo().deviceId}</Text>
            </View>
            
            <View>
              <Text className="text-sm text-gray-600">Expo Token:</Text>
              <Text className="text-sm font-mono text-[#0B2447]">{getDeviceInfo().token}</Text>
            </View>
          </View>
        </View>

        {/* Test Notifications */}
        {notificationsEnabled && (
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-[#0B2447] mb-3">
              Test Notifications
            </Text>
            <Text className="text-gray-600 text-sm mb-3">
              Test the notification system to verify everything is working correctly
            </Text>
            
            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleHealthCheck}
                className="bg-purple-600 rounded-lg py-3 px-4"
              >
                <Text className="text-white text-center font-semibold">
                  API Health Check
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleTestNotification}
                className="bg-[#0B2447] rounded-lg py-3 px-4"
              >
                <Text className="text-white text-center font-semibold">
                  Send Test Notification
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSystemTest}
                className="bg-green-600 rounded-lg py-3 px-4"
              >
                <Text className="text-white text-center font-semibold">
                  Run System Test
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleRegistrationTest}
                className="bg-blue-600 rounded-lg py-3 px-4"
              >
                <Text className="text-white text-center font-semibold">
                  Test Device Registration
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Notification Types */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-[#0B2447] mb-3">
            Notification Types
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="message-text" size={20} color="#0B2447" />
              <Text className="ml-3 text-gray-700">Complaint Updates</Text>
            </View>
            
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="bell-ring" size={20} color="#0B2447" />
              <Text className="ml-3 text-gray-700">Important Announcements</Text>
            </View>
            
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="account-check" size={20} color="#0B2447" />
              <Text className="ml-3 text-gray-700">Account Notifications</Text>
            </View>
          </View>
        </View>

        {/* Help Text */}
        <View className="bg-blue-50 rounded-xl p-4">
          <Text className="text-sm text-blue-800">
            💡 Tip: Make sure to keep notifications enabled to stay updated with your complaint status and important announcements from your hostel management.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
