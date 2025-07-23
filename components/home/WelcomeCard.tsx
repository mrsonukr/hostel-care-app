import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

export const WelcomeCard: React.FC = () => {
  return (
    <View style={styles.welcomeCard}>
      <Text style={styles.welcomeText}>
        Welcome to your HostelCare dashboard. Manage your complaints and
        issues easily.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeCard: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.xl,
  },
  welcomeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
});