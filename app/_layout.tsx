import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { AuthProvider } from '../contexts/AuthContext';
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
    checkAuthStatus();
    // Check auth status less frequently to avoid performance issues
    const interval = setInterval(checkAuthStatus, 5000);
    return () => clearInterval(interval);
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
  );
}
