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
import { errorHandler, AppError, errorMessages } from '../../utils/errorHandler';

export default function LoginScreen() {
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
      const response = await errorHandler.fetchWithErrorHandling(
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
        },
        'login'
      );

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('student', JSON.stringify(data.student));
        setIsAuthenticated(true);
        // Use a small delay to ensure navigation is ready
        setTimeout(() => {
          router.replace('/(protected)/(tabs)');
        }, 100);
      } else {
        // Handle specific login errors
        let errorTitle = 'Login Failed';
        let errorMessage = data.error || 'Invalid username or password.';
        
        if (data.error?.includes('not found') || data.error?.includes('invalid')) {
          errorTitle = 'Invalid Credentials';
          errorMessage = 'Please check your roll number/mobile and password.';
        }
        
        Alert.alert(errorTitle, errorMessage);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        errorHandler.showErrorAlert(error, handleLogin);
      } else {
        const appError = errorHandler.handleFetchError(error, 'login');
        errorHandler.showErrorAlert(appError, handleLogin);
      }
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
            <Text className="text-[28px] font-bold text-[#0B2447] mb-2">Login</Text>
            <Text className="text-base text-[#666] mb-8">Please sign in to continue</Text>

            {/* Username Input */}
            <View className="flex-row items-center bg-[#f2f4f7] rounded-xl px-4 h-[50px] mb-4">
              <MaterialCommunityIcons name="account-outline" size={22} color="#999" />
              <TextInput
                placeholder="Roll Number or Mobile Number"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                className="flex-1 ml-3 text-[16px] text-black"
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
                className="flex-1 ml-3 text-[16px] text-black"
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

            {/* Sign up */}
            <View className="flex-row justify-center">
              <Text className="text-[#666]">Don'have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text className="text-[#0B2447] font-bold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}
