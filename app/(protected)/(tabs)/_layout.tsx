import { Feather, AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, Pressable, View } from 'react-native';
import { useState, useEffect } from 'react';

export default function TabLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  // Custom label component using NativeWind className
  const renderLabel = (label: string, focused: boolean) => (
    <Text className={`text-xs ${focused ? 'text-black' : 'text-gray-400'} font-okra`}>
      {label}
    </Text>
  );

  // Custom notification icon with badge
  const renderNotificationIcon = (color: string) => (
    <View className="relative">
      <Feather name="bell" size={24} color={color} />
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-4 items-center justify-center">
          <Text className="text-white text-xs font-bold px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );

  // Simulate unread count (you can replace this with actual data from your notifications)
  useEffect(() => {
    // For demo purposes, setting to 3 unread notifications
    setUnreadCount(7);
  }, []);

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
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={null} />
        ),
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
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => renderNotificationIcon(color),
          tabBarLabel: ({ focused }) => renderLabel('Notifications', focused),
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
    </Tabs>
  );
}
