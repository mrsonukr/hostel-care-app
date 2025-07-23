import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';

import WelcomeScreen from './pages/WelcomeScreen';
import RegisterScreen1 from './pages/RegisterScreen1';
import RegisterScreen2 from './pages/RegisterScreen2';
import LoginScreen from './pages/LoginScreen';
import ForgotPasswordScreen1 from './pages/ForgotPasswordScreen1';
import ForgotPasswordScreen2 from './pages/ForgotPasswordScreen2';
import ForgotPasswordScreen3 from './pages/ForgotPasswordScreen3';
import HomeScreen from './pages/HomeScreen';
import SettingsScreen from './pages/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
function MainTabs({ route }) {
  const studentData = route?.params?.studentData;

  return (
    <Tab.Navigator
      lazy={false}
      animationEnabled={false}
      swipeEnabled={false}
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#E5E5EA',
          paddingBottom: Platform.OS === 'ios' ? 25 : 15,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 75,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          marginBottom: 0,
        },
        tabBarActiveTintColor: '#007B5D',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarHideOnKeyboard: true,
        unmountOnBlur: false,
        freezeOnBlur: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        initialParams={{ studentData }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
          unmountOnBlur: true, // 👈 Fix: unmount on tab blur
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        initialParams={{ studentData }}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
          unmountOnBlur: true, // 👈 Fix: unmount on tab blur
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} />
        <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} />
        <Stack.Screen name="ForgotPasswordScreen1" component={ForgotPasswordScreen1} />
        <Stack.Screen name="ForgotPasswordScreen2" component={ForgotPasswordScreen2} />
        <Stack.Screen name="ForgotPasswordScreen3" component={ForgotPasswordScreen3} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
