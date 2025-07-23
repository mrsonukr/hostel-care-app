import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

interface InfoItem {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  showWarning?: boolean;
}

interface ProfileInfoSectionProps {
  profileInfo: InfoItem[];
}

export const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  profileInfo,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Profile Information</Text>

      {profileInfo.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.infoItem,
            index === profileInfo.length - 1 && styles.lastInfoItem,
          ]}
        >
          <View style={styles.infoLeft}>
            <Feather name={item.icon} size={20} color={COLORS.primary} />
            <Text style={styles.infoLabel}>{item.label}</Text>
          </View>
          <View style={styles.emailRow}>
            <Text style={styles.infoValue}>{item.value}</Text>
            {item.showWarning && (
              <View style={styles.notVerifiedIcon}>
                <Text style={styles.exclamationText}>!</Text>
              </View>
            )}
          </View>
        </View>
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  lastInfoItem: {
    borderBottomWidth: 0,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notVerifiedIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  exclamationText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});