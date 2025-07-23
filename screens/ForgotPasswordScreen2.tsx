import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Alert,
} from 'react-native';
import type { ForgotPasswordScreen2Props } from '../types/navigation';
import { maskEmail } from '../utils/validation';
import { Header } from '../components/Header';
import { LoadingButton } from '../components/LoadingButton';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

const ForgotPasswordScreen2: React.FC<ForgotPasswordScreen2Props> = ({ navigation, route }) => {
  const { rollNumber, email } = route.params;
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = useCallback((value: string, index: number): void => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleKeyPress = useCallback((key: string, index: number): void => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const clearOtpInputs = useCallback((): void => {
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
  }, []);

  const handleVerifyOTP = useCallback(async (): Promise<void> => {
    const otpString = otp.join('');
    if (!otpString.trim() || otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    // Simulate API call - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock OTP verification - in real app, verify with backend
      if (otpString === '123456') {
        navigation.navigate('ForgotPasswordScreen3', { rollNumber, email });
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.', [
          {
            text: 'OK',
            onPress: clearOtpInputs,
          },
        ]);
      }
    }, 1500);
  }, [otp, navigation, rollNumber, email, clearOtpInputs]);

  const handleResendOTP = useCallback((): void => {
    setTimer(60);
    setCanResend(false);
    clearOtpInputs();
    Alert.alert('Success', 'OTP has been resent to your email');
  }, [clearOtpInputs]);

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

        <Header title="Verify OTP" onBackPress={handleGoBack} />

        <View style={styles.content}>
          <Text style={styles.description}>
            We've sent a 6-digit OTP to your email address
          </Text>

          <Text style={styles.maskedEmail}>{maskEmail(email)}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (otpRefs.current[index] = ref)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e.nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                editable={!isLoading}
                selectTextOnFocus
              />
            ))}
          </View>

          <LoadingButton
            title="Verify OTP"
            onPress={handleVerifyOTP}
            loading={isLoading}
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            {!canResend ? (
              <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOTP} disabled={isLoading}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
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
    marginBottom: SPACING.sm,
    lineHeight: 22,
    textAlign: 'center',
  },
  maskedEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  otpInput: {
    width: 45,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.text,
  },
  verifyButton: {
    marginTop: SPACING.xxxl,
  },
  resendContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  timerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  resendText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen2;