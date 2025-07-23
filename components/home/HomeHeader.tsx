import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

interface HomeHeaderProps {
  onLogout: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onLogout }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Feather name="home" size={24} color={COLORS.primary} />
        <Text style={styles.headerTitle}>HostelCare</Text>
      </View>
      <TouchableOpacity onPress={onLogout} activeOpacity={0.7}>
        <Feather name="log-out" size={22} color={COLORS.primary} />
      </TouchableOpacity>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
});