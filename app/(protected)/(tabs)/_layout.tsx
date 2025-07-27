import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { useNavigationState } from '@react-navigation/native';

export default function TabLayout() {
  const navigationState = useNavigationState(state => state);

  useEffect(() => {
    // Vibrate when tab changes
    if (navigationState?.index !== undefined) {
      Haptics.selectionAsync(); // or Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }, [navigationState?.index]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0D0D0D',
        headerShown: false,
        lazy: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Feather name="bell" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
