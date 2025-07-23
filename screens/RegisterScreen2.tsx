import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Alert,
} from 'react-native';
import type { RegisterScreen2Props } from '../types/navigation';
import { ApiService } from '../services/api';
import { validatePassword } from '../utils/validation';
import { Header } from '../components/Header';
import { LoadingButton } from '../components/LoadingButton';
import { PasswordInput } from '../components/PasswordInput';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

const RegisterScreen2: React.FC<RegisterScreen2Props> = ({ navigation, route }) => {
  const { roll, phone, email } = route.params;
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateInputs = useCallback((): boolean => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill both fields.');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert('Error', 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.');
      return false;
    }

    return true;
  }, [password, confirmPassword]);

  const handleRegister = useCallback(async (): Promise<void> => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const response = await ApiService.signup({
        roll_no: roll,
        mobile_no: phone,
        email: email,
        password: password,
      });

      if (response.success) {
        Alert.alert('Success', 'Registration successful! You can now login.', [
          {
            text: 'OK',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            }),
          },
        ]);
      } else {
        Alert.alert('Error', response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [roll, phone, email, password, navigation, validateInputs]);

  const handleGoBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundTertiary} />

        <Header title="Create Password" onBackPress={handleGoBack} />

        <View style={styles.content}>
          <Text style={styles.label}>Password</Text>
          <PasswordInput
            placeholder="Enter password"
            placeholderTextColor={COLORS.textPlaceholder}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            returnKeyType="next"
          />

          <Text style={styles.label}>Confirm Password</Text>
          <PasswordInput
            placeholder="Confirm password"
            placeholderTextColor={COLORS.textPlaceholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!isLoading}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <LoadingButton
            title="Register"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundTertiary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  registerButton: {
    marginTop: SPACING.xxxl,
  },
});

export default RegisterScreen2;