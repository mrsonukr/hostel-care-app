import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';
import type { StudentData } from '../../types/navigation';

interface ProfileSectionProps {
  studentData: StudentData | null | undefined;
  getDefaultProfileImage: (gender?: string) => string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  studentData,
  getDefaultProfileImage,
}) => {
  return (
    <View style={styles.profileSection}>
      <Image
        source={{
          uri:
            studentData?.profile_pic_url ??
            getDefaultProfileImage(studentData?.gender),
        }}
        style={styles.profileImage}
      />
      <View style={styles.nameContainer}>
        <Text style={styles.profileName}>
          {studentData?.full_name || 'Student Name'}
        </Text>
        <View style={styles.verifiedBadge}>
          <MaterialCommunityIcons name="check-decagram" size={18} color="green" />
        </View>
      </View>
      <Text style={styles.profileRoll}>
        Roll No: {studentData?.roll_no || 'N/A'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    marginTop: SPACING.xl,
    borderRadius: 12,
    marginBottom: SPACING.xl,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SPACING.md,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  profileName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  profileRoll: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});