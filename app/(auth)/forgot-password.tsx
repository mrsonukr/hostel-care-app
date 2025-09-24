import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
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
import { forgotPassword } from '../../utils/passwordApi';

function ForgotPasswordScreenContent() {
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [resendCount, setResendCount] = useState<number>(0);

  // Timer functions
  const getTimerDuration = (count: number): number => {
    if (count === 1) return 60; // 1 minute for first resend
    if (count === 2) return 300; // 5 minutes for second resend
    return 900; // 15 minutes for subsequent resends
  };

  const startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  }, []);

  // Load timer data on component mount
  useEffect(() => {
    const loadTimerData = async () => {
      try {
        const timerData = await AsyncStorage.getItem('forgot_password_timer');
        if (timerData) {
          const { timer: savedTimer, resendCount: savedResendCount, timestamp } = JSON.parse(timerData);
          const now = Date.now();
          const elapsed = Math.floor((now - timestamp) / 1000);
          const remaining = Math.max(0, savedTimer - elapsed);
          
          if (remaining > 0) {
            setTimer(remaining);
            setResendCount(savedResendCount);
            startTimer();
          } else {
            // Timer expired, clear stored data
            await AsyncStorage.removeItem('forgot_password_timer');
          }
        }
      } catch (error) {
        console.error('Error loading timer data:', error);
      }
    };

    loadTimerData();
  }, [startTimer]);

  const handleSendLink = async () => {
    if (timer > 0) {
      Alert.alert('Please wait', `Please wait ${timer} seconds before requesting another password reset.`);
      return;
    }

    if (!rollNumber.trim()) {
      Alert.alert('Error', 'Please enter your roll number.');
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const result = await forgotPassword(rollNumber.trim());

      if (result.success) {
        Alert.alert(
          'Success',
          result.message || 'Password reset instructions sent to your registered email.'
        );
        
        // Start timer after successful request
        const newCount = resendCount + 1;
        const duration = getTimerDuration(newCount);
        
        setResendCount(newCount);
        setTimer(duration);
        
        // Store timer data
        const timerData = {
          timer: duration,
          resendCount: newCount,
          timestamp: Date.now()
        };
        await AsyncStorage.setItem('forgot_password_timer', JSON.stringify(timerData));
        
        startTimer();
      } else {
        Alert.alert('Error', result.error || 'Failed to send reset instructions');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset instructions');
    } finally {
      setForgotPasswordLoading(false);
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
            {/* Header */}
            <View className="mb-8">
              <Text className="text-[28px] font-semibold text-[#0B2447]">Forgot Password</Text>
            </View>

            {/* Description */}
            <Text className="text-base font-okra text-[#666] mb-8">
              Enter roll number to get reset link on email.
            </Text>

            {/* Roll Number Input */}
            <View className="flex-row items-center bg-[#f2f4f7] rounded-xl px-4 h-[50px] mb-6">
              <MaterialCommunityIcons name="account-outline" size={22} color="#999" />
              <TextInput
                placeholder="Enter your roll number"
                placeholderTextColor="#999"
                value={rollNumber}
                onChangeText={setRollNumber}
                className="flex-1 ml-3 text-[16px] font-okra text-black"
                selectionColor="#0B2447"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Send Link Button */}
            <Button
              mode="contained"
              onPress={handleSendLink}
              disabled={forgotPasswordLoading || timer > 0}
              style={{ 
                borderRadius: 12, 
                marginBottom: 20, 
                backgroundColor: timer > 0 ? '#ccc' : '#0D0D0D' 
              }}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            >
              {forgotPasswordLoading ? (
                <RNActivityIndicator color="#fff" />
              ) : timer > 0 ? (
                `Resend in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`
              ) : (
                'Send Link'
              )}
            </Button>

            {/* Back to Login */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-[#666] font-okra">Remember your password? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-[#0B2447] font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

export default function ForgotPasswordScreen() {
  return (
    <OfflineCheck 
      message="You're offline"
      title="No Internet Connection"
    >
      <ForgotPasswordScreenContent />
    </OfflineCheck>
  );
}
