import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

interface LogoutSectionProps {
  onLogout: () => void;
}

export const LogoutSection: React.FC<LogoutSectionProps> = ({ onLogout }) => {
  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Feather name="log-out" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  logoutText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
});