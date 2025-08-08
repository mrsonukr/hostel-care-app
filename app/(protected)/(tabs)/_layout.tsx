import { Feather, AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { useNavigationState } from '@react-navigation/native';
import { Text } from 'react-native';

export default function TabLayout() {
  const navigationState = useNavigationState((state) => state);

  useEffect(() => {
    if (navigationState?.index !== undefined) {
      Haptics.selectionAsync();
    }
  }, [navigationState?.index]);

  // Custom label component using NativeWind className
  const renderLabel = (label: string, focused: boolean) => (
    <Text className={`text-xs ${focused ? 'text-black' : 'text-gray-400'} font-okra`}>
      {label}
    </Text>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,
        tabBarActiveTintColor: '#0D0D0D',
        tabBarLabelStyle: {
          // This won't affect NativeWind, so we override it below with `tabBarLabel`
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
          tabBarLabel: ({ focused }) => renderLabel('Home', focused),
        }}
      />
      <Tabs.Screen
        name="ComplaintScreen"
        options={{
          title: 'Complaint',
          tabBarIcon: ({ color }) => <AntDesign name="pluscircleo" size={24} color={color} />,
          tabBarLabel: ({ focused }) => renderLabel('Complaint', focused),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
          tabBarLabel: ({ focused }) => renderLabel('Settings', focused),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Feather name="bell" size={24} color={color} />,
          tabBarLabel: ({ focused }) => renderLabel('Notifications', focused),
        }}
      />
    </Tabs>
  );
}
