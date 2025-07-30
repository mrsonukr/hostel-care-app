import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ProtectedLayout() {
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (!studentData) {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.replace('/(auth)/login');
    }
  };

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false, // Disable swipe back gesture
        animation: 'none', // Disable animation to prevent back navigation
      }} 
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{
          gestureEnabled: false,
          animation: 'none',
        }}
      />
      <Stack.Screen 
        name="profile-info" 
        options={{ 
          presentation: 'card',
          gestureEnabled: true, // Allow gestures for modal screens
        }} 
      />
      <Stack.Screen 
        name="hostel-details" 
        options={{ 
          presentation: 'card',
          gestureEnabled: true, // Allow gestures for modal screens
        }} 
      />
      <Stack.Screen 
        name="editprofile" 
        options={{ 
          presentation: 'card',
          gestureEnabled: true, // Allow gestures for modal screens
        }} 
      />
    </Stack>
  );
}