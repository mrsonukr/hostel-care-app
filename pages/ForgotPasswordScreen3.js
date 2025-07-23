import React, { useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const ForgotPasswordScreen3 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { rollNumber, email } = route.params;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    };
  };

  const handleResetPassword = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in both password fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      Alert.alert('Error', 'Password does not meet the requirements');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
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
  };

  const passwordValidation = validatePassword(password);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#f7f8fa" />

        {/* Header with back button and title */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
            <Feather name="chevron-left" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reset Password</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            Create a new password for your account
          </Text>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          {password.length > 0 && (
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirement}>
                <Feather 
                  name={passwordValidation.minLength ? 'check-circle' : 'circle'} 
                  size={16} 
                  color={passwordValidation.minLength ? '#007B5D' : '#ccc'} 
                />
                <Text style={[styles.requirementText, passwordValidation.minLength && styles.requirementMet]}>
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.requirement}>
                <Feather 
                  name={passwordValidation.hasUpperCase ? 'check-circle' : 'circle'} 
                  size={16} 
                  color={passwordValidation.hasUpperCase ? '#007B5D' : '#ccc'} 
                />
                <Text style={[styles.requirementText, passwordValidation.hasUpperCase && styles.requirementMet]}>
                  One uppercase letter
                </Text>
              </View>
              <View style={styles.requirement}>
                <Feather 
                  name={passwordValidation.hasLowerCase ? 'check-circle' : 'circle'} 
                  size={16} 
                  color={passwordValidation.hasLowerCase ? '#007B5D' : '#ccc'} 
                />
                <Text style={[styles.requirementText, passwordValidation.hasLowerCase && styles.requirementMet]}>
                  One lowercase letter
                </Text>
              </View>
              <View style={styles.requirement}>
                <Feather 
                  name={passwordValidation.hasNumbers ? 'check-circle' : 'circle'} 
                  size={16} 
                  color={passwordValidation.hasNumbers ? '#007B5D' : '#ccc'} 
                />
                <Text style={[styles.requirementText, passwordValidation.hasNumbers && styles.requirementMet]}>
                  One number
                </Text>
              </View>
              <View style={styles.requirement}>
                <Feather 
                  name={passwordValidation.hasSpecialChar ? 'check-circle' : 'circle'} 
                  size={16} 
                  color={passwordValidation.hasSpecialChar ? '#007B5D' : '#ccc'} 
                />
                <Text style={[styles.requirementText, passwordValidation.hasSpecialChar && styles.requirementMet]}>
                  One special character
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordScreen3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
    marginLeft: -10,

  },
  backIcon: {
    paddingRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  requirementsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  requirementMet: {
    color: '#007B5D',
  },
  button: {
    backgroundColor: '#007B5D',
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});