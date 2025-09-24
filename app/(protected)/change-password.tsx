import React, { useState } from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import CustomHeader from '../../components/CustomHeader';
import InputField from '../../components/InputField';
import { OfflineCheck } from '../../components/withOfflineCheck';
import { changePassword } from '../../utils/passwordApi';
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
