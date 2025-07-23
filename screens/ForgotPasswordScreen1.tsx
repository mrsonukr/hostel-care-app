import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Alert,
} from 'react-native';
import type { ForgotPasswordScreen1Props } from '../types/navigation';
import { validateRollNumber } from '../utils/validation';
import { Header } from '../components/Header';
import { LoadingButton } from '../components/LoadingButton';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

const ForgotPasswordScreen1: React.FC<ForgotPasswordScreen1Props> = ({ navigation }) => {
  const [rollNumber, setRollNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendOTP = useCallback(async (): Promise<void> => {
    if (!validateRollNumber(rollNumber)) {
      Alert.alert('Error', 'Please enter your roll number');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock email for demonstration - in real app, this would come from API
      const mockEmail = 'john.doe@example.com';
      navigation.navigate('ForgotPasswordScreen2', { 
        rollNumber, 
        email: mockEmail 
      });
    }, 1500);
  }, [rollNumber, navigation]);

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

        <Header title="Forgot Password" onBackPress={handleGoBack} />

        <View style={styles.content}>
          <Text style={styles.label}>Roll Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your roll number"
            placeholderTextColor={COLORS.textPlaceholder}
            value={rollNumber}
            onChangeText={setRollNumber}
            keyboardType="default"
            autoCapitalize="none"
            editable={!isLoading}
            returnKeyType="done"
            onSubmitEditing={handleSendOTP}
          />

          <LoadingButton
            title="Send OTP"
            onPress={handleSendOTP}
            loading={isLoading}
            style={styles.sendButton}
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
  input: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  sendButton: {
    marginTop: SPACING.xxxl,
  },
});

export default ForgotPasswordScreen1;