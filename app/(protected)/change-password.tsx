import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import CustomHeader from '../../components/CustomHeader';
import InputField from '../../components/InputField';
import { OfflineCheck } from '../../components/withOfflineCheck';
import { changePassword, forgotPassword } from '../../utils/passwordApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePasswordContent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [resendCount, setResendCount] = useState<number>(0);
  const [studentRollNo, setStudentRollNo] = useState<string>('');

  // Load student data and timer on component mount
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const studentData = await AsyncStorage.getItem('student');
        if (studentData) {
          const student = JSON.parse(studentData);
          setStudentRollNo(student.roll_no);
          
          // Load timer data
          const timerData = await AsyncStorage.getItem('forgot_password_timer');
          if (timerData) {
            const { timer: savedTimer, resendCount: savedCount, timestamp } = JSON.parse(timerData);
            const now = Date.now();
            const elapsed = Math.floor((now - timestamp) / 1000);
            const remaining = Math.max(0, savedTimer - elapsed);
            
            if (remaining > 0) {
              setTimer(remaining);
              setResendCount(savedCount);
              startTimer();
            } else {
              // Timer expired, reset
              setTimer(0);
              setResendCount(0);
              await AsyncStorage.removeItem('forgot_password_timer');
            }
          }
        }
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    };
    
    loadStudentData();
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      // Cleanup any running timers
    };
  }, []);

  // Timer functions
  const getTimerDuration = (count: number) => {
    if (count === 0) return 60; // 1 minute for first resend
    if (count === 1) return 120; // 2 minutes for 2nd resend
    if (count === 2) return 180; // 3 minutes for 3rd resend
    if (count === 3) return 300; // 5 minutes for 4th resend
    if (count === 4) return 600; // 10 minutes for 5th resend
    return 60; // Reset to 1 minute after 5th resend
  };

  const startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(interval);
          // Reset resend count when timer expires (after 5 attempts)
          if (resendCount >= 4) {
            setResendCount(0);
            AsyncStorage.removeItem('forgot_password_timer');
          }
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCount]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Current password validation
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is same as current
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Get student data for roll_no
      const studentData = await AsyncStorage.getItem('student');
      if (!studentData) {
        throw new Error('Student data not found');
      }
      
      const student = JSON.parse(studentData);
      
      const result = await changePassword({
        roll_no: student.roll_no,
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      });

      if (result.success) {
        Alert.alert(
          'Success',
          'Password changed successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to change password');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (timer > 0) {
      Alert.alert('Please wait', `Please wait ${timer} seconds before requesting another password reset.`);
      return;
    }

    if (!studentRollNo) {
      Alert.alert('Error', 'Student data not found');
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const result = await forgotPassword(studentRollNo);

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
    <View className="flex-1 bg-white">
      <CustomHeader title="Change Password" showBackButton onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-5 bg-white">
        <View className="mt-6">
          <InputField
            label="Current Password"
            value={formData.currentPassword}
            onChangeText={(v) => setFormData((p) => ({ ...p, currentPassword: v }))}
            secure={true}
            error={errors.currentPassword}
            placeholder="Enter your current password"
          />

          <InputField
            label="New Password"
            value={formData.newPassword}
            onChangeText={(v) => setFormData((p) => ({ ...p, newPassword: v }))}
            secure={true}
            error={errors.newPassword}
            placeholder="Enter your new password"
            showPasswordToggle={true}
          />

          <InputField
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChangeText={(v) => setFormData((p) => ({ ...p, confirmPassword: v }))}
            secure={true}
            error={errors.confirmPassword}
            placeholder="Confirm your new password"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={submitting}
            style={{ borderRadius: 12, marginTop: 24, backgroundColor: '#0D0D0D' }}
            contentStyle={{ height: 50 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
          >
            {submitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                Change Password
              </Text>
            )}
          </Button>

          <TouchableOpacity 
            onPress={handleForgotPassword}
            disabled={timer > 0 || forgotPasswordLoading}
            className={`mt-4 items-center ${timer > 0 || forgotPasswordLoading ? 'opacity-50' : ''}`}
          >
            {forgotPasswordLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#0D0D0D" />
                <Text className="text-sm text-black font-okra ml-2">
                  Sending...
                </Text>
              </View>
            ) : timer > 0 ? (
              <View className="items-center">
                <Text className="text-sm text-black font-okra">
                  Resend in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </Text>
              </View>
            ) : (
              <Text className="text-sm text-black font-okra">
                Forgot Password?
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default function ChangePassword() {
  return (
    <OfflineCheck 
      message="You're offline"
      title="No Internet Connection"
    >
      <ChangePasswordContent />
    </OfflineCheck>
  );
}
