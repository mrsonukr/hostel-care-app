import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StatusBar, Platform } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { AuthProvider } from '../contexts/AuthContext';
import { OfflineProvider } from '../contexts/OfflineContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { setupNotificationHandlers, checkAndUpdateToken } from '../utils/notificationApi';

import "../global.css"

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [fontsLoaded, fontError] = Font.useFonts({
    'Okra-Regular': require('../assets/fonts/okra_regular.ttf'),
    'Okra-Bold': require('../assets/fonts/okra_bold.ttf'),
    'Okra-Light': require('../assets/fonts/okra_light.ttf'),
    'Okra-Medium': require('../assets/fonts/okra_medium.ttf'),
    'Okra-SemiBold': require('../assets/fonts/okra_semibold.ttf'),
    'Okra-Thin': require('../assets/fonts/okra_thin.ttf'),
  });

  useEffect(() => {
    // Configure status bar for both platforms
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('white');
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(false);
      // Ensure the status bar doesn't create extra spacing
      StatusBar.setBarStyle('dark-content', true);
    } else if (Platform.OS === 'ios') {
      // iOS: Set status bar to dark mode (black text/icons)
      StatusBar.setBarStyle('dark-content');
      // Ensure status bar is visible and properly configured
      StatusBar.setHidden(false);
    }
    
    // Setup notification handlers
    const cleanup = setupNotificationHandlers();
    
    checkAuthStatus();
    // Check auth status less frequently to avoid performance issues
    const interval = setInterval(checkAuthStatus, 5000);
    
    // Check for token updates every 30 seconds
    const tokenUpdateInterval = setInterval(async () => {
      try {
        const studentData = await AsyncStorage.getItem('student');
        if (studentData) {
          const student = JSON.parse(studentData);
          await checkAndUpdateToken(student.roll_no);
        }
      } catch (error) {
        console.error('Error checking token update:', error);
      }
    }, 30000);
    
    return () => {
      clearInterval(interval);
      clearInterval(tokenUpdateInterval);
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);



  const checkAuthStatus = async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      setIsAuthenticated(!!studentData);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  if (!fontsLoaded && !fontError) {
    return null; // Keep splash screen visible while fonts load
  }

  if (isAuthenticated === null) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0D0D0D" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <OfflineProvider>
  
        <AuthProvider>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: false, // Disable swipe back gesture globally
              }}
            />
          </SafeAreaProvider>
        </AuthProvider>
      </OfflineProvider>
    </ErrorBoundary>
  );
}
