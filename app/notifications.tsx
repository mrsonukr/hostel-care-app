import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

export default function NotificationsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the notifications tab
    router.replace('/(protected)/(tabs)/notifications');
  }, [router]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0D0D0D" />
      <Text className="text-gray-500 mt-4">Opening notifications...</Text>
    </View>
  );
}



