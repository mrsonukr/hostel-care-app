import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedLayout() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      // Use a small delay to ensure navigation is ready
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 100);
    }
  }, [isAuthenticated, router]);

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
      <Stack.Screen 
        name="privacy-policy" 
        options={{ 
          presentation: 'card',
          gestureEnabled: true, // Allow gestures for modal screens
        }} 
      />
      <Stack.Screen 
        name="help-support" 
        options={{ 
          presentation: 'card',
          gestureEnabled: true, // Allow gestures for modal screens
        }} 
      />
    </Stack>
  );
}