import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../../components/CustomHeader';
import * as Notifications from 'expo-notifications';

const notifications = [
  {
    id: 1,
    expoNotificationId: 'expo-notification-001',
    name: 'Amit Kumar',
    date: '20 Jul, Monday',
    status: 'Active',
    initial: 'A',
  },
  {
    id: 2,
    expoNotificationId: 'expo-notification-002',
    name: 'Sneha Verma',
    date: '21 Jul, Sunday',
    status: 'Resolved',
    initial: 'S',
  },
  {
    id: 3,
    expoNotificationId: 'expo-notification-003',
    name: 'Ravi Patel',
    date: '22 Jul, Saturday',
    status: 'Pending',
    initial: 'R',
  },
];

export default function NotificationsTab() {
  const [expoNotificationId, setExpoNotificationId] = useState<string>('Loading...');
  const [permissionStatus, setPermissionStatus] = useState<string>('Checking...');

  // Get current Expo notification ID for testing
  useEffect(() => {
    const getNotificationInfo = async () => {
      try {
        // Check permission status
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionStatus(status);

        if (status !== 'granted') {
          setExpoNotificationId('Permission not granted');
          console.log('🔔 Notification Permission: Not granted');
          return;
        }

        // Try to get stored token first
        const storedToken = await AsyncStorage.getItem('expoPushToken');
        if (storedToken) {
          setExpoNotificationId(storedToken);
          console.log('🔔 Expo Notification ID (from storage):', storedToken);
          return;
        }

        // If no stored token, get a new one
        const token = await Notifications.getExpoPushTokenAsync();
        setExpoNotificationId(token.data);
        console.log('🔔 Expo Notification ID (new):', token.data);
        
        // Store the token
        await AsyncStorage.setItem('expoPushToken', token.data);
        
      } catch (error) {
        setExpoNotificationId('Error getting notification ID');
        console.log('🔔 Error getting notification ID:', error);
      }
    };

    getNotificationInfo();
  }, []);

  const requestPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        // Try to get token again
        const token = await Notifications.getExpoPushTokenAsync();
        setExpoNotificationId(token.data);
        console.log('🔔 Expo Notification ID (after permission):', token.data);
        await AsyncStorage.setItem('expoPushToken', token.data);
      } else {
        setExpoNotificationId('Permission denied');
        console.log('🔔 Notification Permission: Denied');
      }
    } catch (error) {
      setExpoNotificationId('Permission error');
      console.log('🔔 Permission error:', error);
    }
  };

  return (
    <>
      <CustomHeader title="Notifications" />
      <ScrollView style={styles.container}>
        {/* Expo Notification ID Testing Section */}
        <View className="w-full px-4 py-4 bg-blue-50 border-b border-blue-200">
          <Text className="text-lg font-bold text-blue-800 mb-2">
            🔔 Expo Notification ID (Testing)
          </Text>
          
          <Text className="text-sm text-blue-600 mb-2">
            Current Device Token:
          </Text>
          
          <Text className="text-xs text-blue-700 bg-blue-100 p-2 rounded font-mono mb-2">
            {expoNotificationId}
          </Text>
          
          {permissionStatus !== 'granted' && (
            <Text 
              className="text-sm text-blue-600 underline"
              onPress={requestPermission}
            >
              Tap to request permission
            </Text>
          )}
        </View>

        {/* Sample Notifications with Expo IDs */}
        <View className="w-full px-4 py-2">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Sample Notifications
          </Text>
        </View>

        {notifications.map((item, index) => (
          <View key={item.id} className="w-full px-4">
            <View className="flex-row items-center justify-between py-4">
              {/* Avatar + Info */}
              <View className="flex-row items-center gap-6">
                {/* Avatar */}
                <View className="bg-black w-12 h-12 items-center justify-center rounded-full">
                  <Text className="text-white text-2xl font-semibold">
                    {item.initial}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-800">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-500">{item.date}</Text>
                  <Text className="text-xs text-gray-400 font-mono mt-1">
                    ID: {item.expoNotificationId}
                  </Text>
                </View>
              </View>

              {/* Status */}
              <Text className="text-green-600 font-semibold text-sm">
                {item.status}
              </Text>
            </View>

            {/* Bottom border (excluding avatar) */}
            <View className="border-b border-gray-200 ml-[r]" />
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
