import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator as RNActivityIndicator,
} from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { OfflineCheck } from '../../components/withOfflineCheck';
import { registerDevice, checkNotificationPermissions, checkAndUpdateToken, getExpoPushToken } from '../../utils/notificationApi';

function LoginScreenContent() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://hostelapis.mssonutech.workers.dev/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        await AsyncStorage.setItem('student', JSON.stringify(data.student));
        setIsAuthenticated(true);
        
        // Register device for push notifications
        try {
          console.log('Student data received:', data.student);
          if (data.student && data.student.roll_no) {
            console.log('Registering device for user:', data.student.roll_no);
            const hasPermission = await checkNotificationPermissions();
            if (hasPermission) {
              const deviceResult = await registerDevice(data.student.roll_no);
              if (deviceResult.success) {
                console.log('Device registered successfully for notifications');
                // Store the token for future update checks
                const token = await getExpoPushToken();
                if (token) {
                  await AsyncStorage.setItem('expo_push_token', token);
                }
              } else {
                console.warn('Failed to register device for notifications:', deviceResult.error);
              }
            } else {
              console.warn('Notification permissions not granted');
            }
          } else {
            console.warn('Student data missing roll_no, skipping device registration');
          }
        } catch (notificationError) {
          console.error('Error setting up notifications:', notificationError);
          // Don't block login if notification setup fails
        }
        
        // Use a small delay to ensure navigation is ready
        setTimeout(() => {
          router.replace('/(protected)/(tabs)');
        }, 100);
      } else {
        // Handle specific login errors based on status code and error message
        let errorTitle = 'Login Failed';
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (response.status === 401) {
          errorTitle = 'Invalid Credentials';
          errorMessage = 'username or password is incorrect. Please check and try again.';
        } else if (response.status === 400) {
          errorTitle = 'Invalid Input';
          errorMessage = data.error || 'Please check your input and try again.';
        } else if (response.status >= 500) {
          errorTitle = 'Server Error';
          errorMessage = 'Our servers are experiencing issues. Please try again later.';
        } else if (data.error) {
          errorTitle = 'Login Error';
          errorMessage = data.error;
        }
        
        Alert.alert(errorTitle, errorMessage);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorTitle = 'Connection Error';
      let errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      
      if (error.message?.includes('Network request failed') || 
          error.message?.includes('fetch') ||
          error.message?.includes('network') ||
          error.message?.includes('connection')) {
        errorMessage = 'Please check your internet connection and try again.';
      } else if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
        errorTitle = 'Request Timeout';
        errorMessage = 'The request took too long. Please try again.';
      }
      
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 px-5 pt-16">
            {/* Heading */}
            <Text className="text-[28px] font-semibold text-[#0B2447] mb-2">Login</Text>
            <Text className="text-base font-okra text-[#666] mb-8">Please sign in to continue</Text>

            {/* Username Input */}
            <View className="flex-row items-center bg-[#f2f4f7] rounded-xl px-4 h-[50px] mb-4">
              <MaterialCommunityIcons name="account-outline" size={22} color="#999" />
              <TextInput
                placeholder="Roll Number or Mobile Number"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                className="flex-1 ml-3 text-[16px] font-okra text-black"
                selectionColor="#0B2447"
              />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center bg-[#f2f4f7] rounded-xl px-4 h-[50px] mb-6">
              <MaterialCommunityIcons name="lock-outline" size={22} color="#999" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="flex-1 ml-3 text-[16px] font-okra text-black"
                selectionColor="#0B2447"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              disabled={loading}
              style={{ borderRadius: 12, marginBottom: 20, backgroundColor: '#0D0D0D' }}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            >
              {loading ? <RNActivityIndicator color="#fff" /> : 'Sign In'}
            </Button>

            {/* Forgot Password Button */}
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/forgot-password')}
              className="items-center mb-4"
            >
              <Text className="text-[#0B2447] font-semibold">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Sign up */}
            <View className="flex-row justify-center">
              <Text className="text-[#666] font-okra">Don'have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text className="text-[#0B2447] font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

export default function LoginScreen() {
  return (
    <OfflineCheck 
      message="You're offline"
      title="No Internet Connection"
    >
      <LoginScreenContent />
    </OfflineCheck>
  );
}
