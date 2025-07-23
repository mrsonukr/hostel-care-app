import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

export const SettingsHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={{ width: 24 }} />
      <Text style={styles.headerTitle}>Settings</Text>
      <View style={{ width: 24 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
});