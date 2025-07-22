import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './pages/WelcomeScreen';
import RegisterScreen1 from './pages/RegisterScreen1';
import RegisterScreen2 from './pages/RegisterScreen2';
import LoginScreen from './pages/LoginScreen';
import ForgotPasswordScreen1 from './pages/ForgotPasswordScreen1';
import ForgotPasswordScreen2 from './pages/ForgotPasswordScreen2';
import ForgotPasswordScreen3 from './pages/ForgotPasswordScreen3';
import HomeScreen from './pages/HomeScreen';

const Stack = createNativeStackNavigator();

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
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
