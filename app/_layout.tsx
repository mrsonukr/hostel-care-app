import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as Font from 'expo-font';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import "../global.css"; // NativeWind global styles

export default function RootLayout() {
  useFrameworkReady();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [fontsLoaded] = Font.useFonts({
    'Okra-Regular': require('../assets/fonts/okra_regular.ttf'),
    'Okra-Bold': require('../assets/fonts/okra_bold.ttf'),
    'Okra-Light': require('../assets/fonts/okra_light.ttf'),
    'Okra-Medium': require('../assets/fonts/okra_medium.ttf'),
    'Okra-SemiBold': require('../assets/fonts/okra_semibold.ttf'),
    'Okra-Thin': require('../assets/fonts/okra_thin.ttf'),
  });

  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      setIsAuthenticated(!!studentData);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  if (!fontsLoaded || isAuthenticated === null) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0D0D0D" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
