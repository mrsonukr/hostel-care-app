import { Feather, AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, Pressable, View, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabLayout() {
  const [unreadCount, setUnreadCount] = useState(0);
  const insets = useSafeAreaInsets();

  // Custom label component using NativeWind className
  const renderLabel = (label: string, focused: boolean) => (
    <Text className={`text-xs ${focused ? 'text-black' : 'text-gray-400'} font-okra`}>
      {label}
    </Text>
  );

  // Custom notification icon with counter badge
  const renderNotificationIcon = (color: string) => (
    <View className="relative" style={{ minWidth: 32, minHeight: 32, justifyContent: 'center', alignItems: 'center' }}>
      <Feather name="bell" size={24} color={color} />
      {unreadCount > 0 && (
        <Text 
          className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-4 text-white text-xs font-bold px-1 text-center"
          style={{ 
            zIndex: 1,
            pointerEvents: 'none' // Prevents badge from interfering with touch events
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Text>
      )}
    </View>
  );

  // TODO: Replace with actual notification data from your backend
  useEffect(() => {
    // setUnreadCount(actualCount);
  }, []);

  return (
    <>

      <Tabs
        screenOptions={{
          headerShown: false,
          lazy: false,
          tabBarActiveTintColor: '#0D0D0D',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0.5,
            borderTopColor: '#e5e7eb',
            elevation: 0,
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          tabBarButton: (props) => (
            <Pressable 
              {...(props as any)} 
              android_ripple={null}
              style={[
                props.style,
                { 
                  minHeight: 44, // Ensures minimum touch target size
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 8, // Add horizontal padding for better touch area
                }
              ]}
            />
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
            tabBarItemStyle: {
              paddingVertical: 4,
              minHeight: 44, // Ensures proper touch target
              paddingHorizontal: 4, // Add horizontal padding
            },
          }}
        />
        <Tabs.Screen
          name="test"
          options={{
            title: 'Test',
            tabBarIcon: ({ color }) => <Feather name="activity" size={24} color={color} />,
            tabBarLabel: ({ focused }) => renderLabel('Test', focused),
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
    </>
  );
}
