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
import { Feather } from '@expo/vector-icons';
import type { ForgotPasswordScreen3Props } from '../types/navigation';
import { validatePassword } from '../utils/validation';
import { Header } from '../components/Header';
import { LoadingButton } from '../components/LoadingButton';
import { PasswordInput } from '../components/PasswordInput';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

interface PasswordRequirement {
  met: boolean;
  text: string;
}

const ForgotPasswordScreen3: React.FC<ForgotPasswordScreen3Props> = ({ navigation, route }) => {
  const { rollNumber, email } = route.params;
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const passwordValidation = validatePassword(password);

  const requirements: PasswordRequirement[] = [
    { met: passwordValidation.minLength, text: 'At least 8 characters' },
    { met: passwordValidation.hasUpperCase, text: 'One uppercase letter' },
    { met: passwordValidation.hasLowerCase, text: 'One lowercase letter' },
    { met: passwordValidation.hasNumbers, text: 'One number' },
    { met: passwordValidation.hasSpecialChar, text: 'One special character' },
  ];

  const validateInputs = useCallback((): boolean => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in both password fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!passwordValidation.isValid) {
      Alert.alert('Error', 'Password does not meet the requirements');
      return false;
    }

    return true;
  }, [password, confirmPassword, passwordValidation.isValid]);

  const handleResetPassword = useCallback(async (): Promise<void> => {
    if (!validateInputs()) return;

    setIsLoading(true);
    
    // Simulate API call - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success', 
        'Your password has been reset successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            })
          }
        ]
      );
    }, 1500);
  }, [navigation, validateInputs]);

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

        <Header title="Reset Password" onBackPress={handleGoBack} />

        <View style={styles.content}>
          <Text style={styles.description}>
            Create a new password for your account
          </Text>

          <Text style={styles.label}>New Password</Text>
          <PasswordInput
            placeholder="Enter new password"
            placeholderTextColor={COLORS.textPlaceholder}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            returnKeyType="next"
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <PasswordInput
            placeholder="Confirm new password"
            placeholderTextColor={COLORS.textPlaceholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!isLoading}
            returnKeyType="done"
            onSubmitEditing={handleResetPassword}
          />

          {password.length > 0 && (
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              {requirements.map((requirement, index) => (
                <View key={index} style={styles.requirement}>
                  <Feather 
                    name={requirement.met ? 'check-circle' : 'circle'} 
                    size={16} 
                    color={requirement.met ? COLORS.primary : COLORS.gray} 
                  />
                  <Text style={[
                    styles.requirementText, 
                    requirement.met && styles.requirementMet
                  ]}>
                    {requirement.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <LoadingButton
            title="Reset Password"
            onPress={handleResetPassword}
            loading={isLoading}
            style={styles.resetButton}
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
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxxl,
    lineHeight: 22,
    textAlign: 'center',
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  requirementsContainer: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 10,
  },
  requirementsTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  requirementText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  requirementMet: {
    color: COLORS.primary,
  },
  resetButton: {
    marginTop: SPACING.xxxl,
  },
});

export default ForgotPasswordScreen3;