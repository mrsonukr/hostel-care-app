import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Alert,
} from 'react-native';
import type { LoginScreenProps } from '../types/navigation';
import { ApiService } from '../services/api';
import { validateEmail, validatePhone } from '../utils/validation';
import { LoadingButton } from '../components/LoadingButton';
import { PasswordInput } from '../components/PasswordInput';
import { Header } from '../components/Header';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const passwordRef = useRef<TextInput>(null);

  const handleIdentifierChange = useCallback((text: string): void => {
    setIdentifier(text);
  }, []);

  const validateInput = useCallback((): boolean => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in both fields');
      return false;
    }

    if (password.length < 5) {
      Alert.alert('Error', 'Password must be at least 5 characters long');
      return false;
    }

    return true;
  }, [identifier, password]);

  const handleLogin = useCallback(async (): Promise<void> => {
    if (!validateInput()) return;

    setIsLoading(true);

    try {
      const response = await ApiService.login(identifier, password);

      if (response.success && response.student) {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Home', params: { studentData: response.student } }],
            }),
          },
        ]);
      } else {
        Alert.alert('Error', response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [identifier, password, navigation, validateInput]);

  const handleForgotPassword = useCallback((): void => {
    navigation.navigate('ForgotPasswordScreen1');
  }, [navigation]);

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

        <Header title="Login" onBackPress={handleGoBack} />

        <View style={styles.content}>
          <Text style={styles.label}>Roll No, Email or Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter roll no, email or phone"
            placeholderTextColor={COLORS.textPlaceholder}
            value={identifier}
            onChangeText={handleIdentifierChange}
            keyboardType="default"
            autoCapitalize="none"
            editable={!isLoading}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            multiline={false}
          />

          <Text style={styles.label}>Password</Text>
          <PasswordInput
            ref={passwordRef}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.textPlaceholder}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <LoadingButton
            title="Log In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <TouchableOpacity 
            onPress={handleForgotPassword}
            disabled={isLoading}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
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
  loginButton: {
    marginTop: SPACING.xxxl,
  },
  forgotPasswordButton: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
});

export default LoginScreen;