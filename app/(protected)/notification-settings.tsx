import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeader from '../../components/CustomHeader';
import { notificationEvents, NOTIFICATION_EVENTS } from '../../utils/notificationEvents';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Test Notification',
    body: 'This is a test notification from HostelCare!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  Alert.alert('Error', errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    
    // Try multiple ways to get project ID
    const projectId = 
      Constants?.expoConfig?.extra?.eas?.projectId ?? 
      Constants?.easConfig?.projectId ??
      'f3731760-8c45-4c07-8b1e-0172561149c6'; // Fallback to your actual project ID
    
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      return pushTokenString;
    } catch (e: unknown) {
      // For development, return a dummy token to test UI
      const errorMessage = `Push token error: ${e}`;
      return errorMessage;
    }
  } else {
    const errorMessage = 'Must use physical device for push notifications';
    return errorMessage;
  }
}

export default function NotificationSettings() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        setExpoPushToken(token ?? 'No token received');
        setLoading(false);
      })
      .catch((error: any) => {
        setExpoPushToken(`Registration failed: ${error}`);
        setLoading(false);
      });

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      // Emit event to refresh last notification section
      notificationEvents.emit(NOTIFICATION_EVENTS.PUSH_NOTIFICATION_RECEIVED, notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    // Listen for push notification events to refresh last notification
    const handlePushNotificationReceived = (notification: Notifications.Notification) => {
      setNotification(notification);
    };

    // Add event listener for push notifications
    notificationEvents.on(NOTIFICATION_EVENTS.PUSH_NOTIFICATION_RECEIVED, handlePushNotificationReceived);

    return () => {
      notificationListener.remove();
      responseListener.remove();
      notificationEvents.off(NOTIFICATION_EVENTS.PUSH_NOTIFICATION_RECEIVED, handlePushNotificationReceived);
    };
  }, []);

  const handleSendTestNotification = async () => {
    if (expoPushToken && !expoPushToken.includes('error') && !expoPushToken.includes('failed')) {
      try {
        await sendPushNotification(expoPushToken);
        Alert.alert('Success', 'Test notification sent!');
        
        // Emit event to refresh last notification section
        // This will trigger the event listener we added above
        notificationEvents.emit(NOTIFICATION_EVENTS.PUSH_NOTIFICATION_RECEIVED, {
          request: {
            content: {
              title: 'Test Notification',
              body: 'This is a test notification from HostelCare!',
              data: { someData: 'goes here' }
            }
          }
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to send notification');
      }
    } else {
      Alert.alert('Error', 'Push token not available. Please check your device settings.');
    }
  };

  return (
    <>
      <CustomHeader 
        title="Notification Settings" 
        showBackButton 
        onBackPress={() => router.back()}
      />
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 20 }}>
        
        {/* Push Token Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Feather name="smartphone" size={24} color="#0D0D0D" />
            <Text className="ml-3 text-xl font-semibold text-black">Push Token</Text>
          </View>
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-sm text-gray-600 mb-2">Your Expo Push Token:</Text>
            <Text className="text-xs text-gray-800 font-mono" numberOfLines={3}>
              {loading ? 'Loading...' : expoPushToken}
            </Text>
          </View>
        </View>

        {/* Test Notification Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Feather name="bell" size={24} color="#0D0D0D" />
            <Text className="ml-3 text-xl font-semibold text-black">Test Notifications</Text>
          </View>
          <TouchableOpacity
            onPress={handleSendTestNotification}
            className="bg-blue-500 py-4 px-6 rounded-lg mb-4"
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Send Test Notification
            </Text>
          </TouchableOpacity>
        </View>

        {/* Last Notification Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Feather name="activity" size={24} color="#0D0D0D" />
            <Text className="ml-3 text-xl font-semibold text-black">Last Notification</Text>
          </View>
          <View className="bg-gray-50 p-4 rounded-lg">
            {notification ? (
              <View>
                <Text className="text-sm text-gray-600 mb-2">Title:</Text>
                <Text className="text-base text-black mb-3">
                  {notification.request.content.title}
                </Text>
                
                <Text className="text-sm text-gray-600 mb-2">Body:</Text>
                <Text className="text-base text-black mb-3">
                  {notification.request.content.body}
                </Text>
                
                <Text className="text-sm text-gray-600 mb-2">Data:</Text>
                <Text className="text-xs text-gray-800 font-mono">
                  {JSON.stringify(notification.request.content.data)}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-500 text-center py-4">
                No notifications received yet
              </Text>
            )}
          </View>
        </View>

        {/* Notification Settings Info */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Feather name="info" size={24} color="#0D0D0D" />
            <Text className="ml-3 text-xl font-semibold text-black">Information</Text>
          </View>
          <View className="bg-blue-50 p-4 rounded-lg">
            <Text className="text-sm text-blue-800 mb-2">
              • Push notifications require a physical device
            </Text>
            <Text className="text-sm text-blue-800 mb-2">
              • Make sure notifications are enabled in device settings
            </Text>
            <Text className="text-sm text-blue-800 mb-2">
              • Test notifications will be sent to your device
            </Text>
            <Text className="text-sm text-blue-800">
              • Check your device's notification panel for received notifications
            </Text>
          </View>
        </View>

      </ScrollView>
    </>
  );
}