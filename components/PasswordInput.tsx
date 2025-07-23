import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  TextInput as RNTextInput,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/colors';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  containerStyle?: ViewStyle;
}

// ⬇️ Add forwardRef support here
export const PasswordInput = forwardRef<RNTextInput, PasswordInputProps>(
  ({ containerStyle, style, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        <RNTextInput
          ref={ref}
          style={[styles.input, style]}
          secureTextEntry={!showPassword}
          {...props}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Feather
            name={showPassword ? 'eye' : 'eye-off'}
            size={22}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>
    );
  }
);

// Optional: give component a display name for debugging
PasswordInput.displayName = 'PasswordInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeButton: {
    padding: SPACING.xs,
  },
});
