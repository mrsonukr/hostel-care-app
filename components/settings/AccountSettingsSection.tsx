import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

interface SettingItem {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}

interface AccountSettingsSectionProps {
  settingItems: SettingItem[];
}

export const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({
  settingItems,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Settings</Text>

      {settingItems.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.settingItem,
            index === settingItems.length - 1 && styles.lastSettingItem,
          ]}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.settingLeft}>
            <Feather name={item.icon} size={20} color={COLORS.primary} />
            <Text style={styles.settingLabel}>{item.label}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={COLORS.gray} />
        </TouchableOpacity>
      ))}
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
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
});