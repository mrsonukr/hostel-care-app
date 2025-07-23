import React, { useState, useCallback } from 'react';
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
import type { RegisterScreen1Props } from '../types/navigation';
import { validateEmail, validatePhone, validateRollNumber } from '../utils/validation';
import { Header } from '../components/Header';
import { LoadingButton } from '../components/LoadingButton';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

const RegisterScreen1: React.FC<RegisterScreen1Props> = ({ navigation }) => {
  const [roll, setRoll] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const validateInputs = useCallback((): boolean => {
    if (!validateRollNumber(roll)) {
      Alert.alert('Error', 'Please enter a valid roll number');
      return false;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return false;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  }, [roll, phone, email]);

  const handleNext = useCallback((): void => {
    if (validateInputs()) {
      navigation.navigate('RegisterScreen2', { roll, phone, email });
    }
  }, [roll, phone, email, navigation, validateInputs]);

  const handleGoBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const handleLoginNavigation = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundTertiary} />

        <Header title="Register" onBackPress={handleGoBack} />

        <View style={styles.content}>
          <Text style={styles.label}>Roll Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter roll number"
            placeholderTextColor={COLORS.textPlaceholder}
            keyboardType="default"
            value={roll}
            onChangeText={setRoll}
            autoCapitalize="none"
            returnKeyType="next"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor={COLORS.textPlaceholder}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
            returnKeyType="next"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor={COLORS.textPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            returnKeyType="done"
            onSubmitEditing={handleNext}
          />

          <LoadingButton
            title="Next"
            onPress={handleNext}
            style={styles.nextButton}
          />

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLoginNavigation}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
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
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
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
  nextButton: {
    marginTop: SPACING.xxxl,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  loginLinkText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});

export default RegisterScreen1;