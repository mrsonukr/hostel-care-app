import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import type { RootStackParamList } from './types/navigation';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen1 from './screens/RegisterScreen1';
import RegisterScreen2 from './screens/RegisterScreen2';
import ForgotPasswordScreen1 from './screens/ForgotPasswordScreen1';
import ForgotPasswordScreen2 from './screens/ForgotPasswordScreen2';
import ForgotPasswordScreen3 from './screens/ForgotPasswordScreen3';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationScreen from './screens/NotificationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right',
          }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} />
          <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} />
          <Stack.Screen name="ForgotPasswordScreen1" component={ForgotPasswordScreen1} />
          <Stack.Screen name="ForgotPasswordScreen2" component={ForgotPasswordScreen2} />
          <Stack.Screen name="ForgotPasswordScreen3" component={ForgotPasswordScreen3} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
};

export default App;