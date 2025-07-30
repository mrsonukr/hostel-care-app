import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator as RNActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rollNo: '',
    gender: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.rollNo.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (formData.mobileNo && formData.mobileNo.length !== 10) {
      Alert.alert('Error', 'Mobile number must be 10 digits.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://hostelapis.mssonutech.workers.dev/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roll_no: formData.rollNo,
          gender: (formData.gender || 'male').toLowerCase(),
          mobile_no: formData.mobileNo,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.status === 201 && data.success) {
        Alert.alert('Success', 'Account created successfully! Please login.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ]);
      } else {
        Alert.alert('Error', data.error || 'Failed to create account.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Signup error:', error);
      Alert.alert('Error', 'Failed to connect to the server. Please try again later.');
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
            <Text className="text-[28px] font-bold text-[#0B2447] mb-2">Sign Up</Text>
            <Text className="text-base text-[#666] mb-8">Create your account</Text>

            {/* Roll No */}
            <View className="flex-row items-center bg-[#f2f4f7] rounded-full px-4 h-[50px] mb-4">
              <MaterialCommunityIcons name="account-outline" size={22} color="#999" />
              <TextInput
                placeholder="Roll Number *"
                placeholderTextColor="#999"
                value={formData.rollNo}
                onChangeText={(text) => setFormData(prev => ({ ...prev, rollNo: text }))}
                className="flex-1 ml-3 text-[16px] text-black"
                selectionColor="#0B2447"
              />
            </View>

            {/* Mobile No */}
            <View className="flex-row items-center bg-[#f2f4f7] rounded-full px-4 h-[50px] mb-4">
              <MaterialCommunityIcons name="phone-outline" size={22} color="#999" />
              <TextInput
                placeholder="Mobile Number *"
                placeholderTextColor="#999"
                value={formData.mobileNo}
                onChangeText={(text) => setFormData(prev => ({ ...prev, mobileNo: text }))}
                keyboardType="phone-pad"
                maxLength={10}
                className="flex-1 ml-3 text-[16px] text-black"
                selectionColor="#0B2447"
              />
            </View>

            {/* Email */}
            <View className="flex-row items-center bg-[#f2f4f7] rounded-full px-4 h-[50px] mb-4">
              <MaterialCommunityIcons name="email-outline" size={22} color="#999" />
              <TextInput
                placeholder="Email *"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-[16px] text-black"
                selectionColor="#0B2447"
              />
            </View>

            {/* Password */}
            <View className="flex-row items-center bg-[#f2f4f7] rounded-full px-4 h-[50px] mb-4">
              <MaterialCommunityIcons name="lock-outline" size={22} color="#999" />
              <TextInput
                placeholder="Password *"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
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

            {/* Confirm Password */}
            <View className="flex-row items-center bg-[#f2f4f7] rounded-full px-4 h-[50px] mb-6">
              <MaterialCommunityIcons name="lock-outline" size={22} color="#999" />
              <TextInput
                placeholder="Confirm Password *"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                secureTextEntry={!showConfirmPassword}
                className="flex-1 ml-3 text-[16px] text-black"
                selectionColor="#0B2447"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <Button
              mode="contained"
              onPress={handleSignup}
              disabled={loading}
              style={{
                borderRadius: 30,
                marginBottom: 20,
                backgroundColor: '#0D0D0D',
              }}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            >
              {loading ? <RNActivityIndicator color="#fff" /> : 'Sign Up'}
            </Button>

            {/* Sign In Link */}
            <View className="flex-row justify-center">
              <Text className="text-[#666]">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text className="text-[#0B2447] font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}
