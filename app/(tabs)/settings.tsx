import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { User, Phone, Mail, Chrome as HomeIcon, Building, LocationEdit as Edit3, Lock, Bell, Shield, Circle as HelpCircle, LogOut, Check } from 'lucide-react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

interface InfoItem {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  showWarning?: boolean;
}

interface SettingItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
}

export default function SettingsScreen() {
  // Mock student data - in real app this would come from context/state
  const studentData = {
    full_name: 'John Doe',
    roll_no: 'CS2021001',
    mobile_no: '9876543210',
    email: 'john.doe@example.com',
    email_verified: 1,
    gender: 'male',
    room_no: '101',
    hostel_no: 'A',
    profile_pic_url: null,
  };

  const getDefaultProfileImage = useCallback((gender?: string): string => {
    return gender === 'female' 
      ? 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
      : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400';
  }, []);

  const handleLogout = useCallback((): void => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => router.replace('/'),
      },
    ]);
  }, []);

  const handleEditProfile = useCallback((): void => {
    Alert.alert('Feature', 'Edit Profile feature coming soon!');
  }, []);

  const handleChangePassword = useCallback((): void => {
    Alert.alert('Feature', 'Change Password feature coming soon!');
  }, []);

  const handleNotifications = useCallback((): void => {
    Alert.alert('Feature', 'Notifications settings coming soon!');
  }, []);

  const handlePrivacy = useCallback((): void => {
    Alert.alert('Feature', 'Privacy & Security settings coming soon!');
  }, []);

  const handleHelp = useCallback((): void => {
    Alert.alert('Feature', 'Help & Support coming soon!');
  }, []);

  const profileInfo: InfoItem[] = [
    {
      id: 'name',
      label: 'Full Name',
      value: studentData?.full_name || 'N/A',
      icon: User,
    },
    {
      id: 'phone',
      label: 'Mobile Number',
      value: studentData?.mobile_no || 'N/A',
      icon: Phone,
    },
    {
      id: 'email',
      label: 'Email',
      value: studentData?.email || 'N/A',
      icon: Mail,
      showWarning: studentData?.email_verified !== 1,
    },
    {
      id: 'room',
      label: 'Room Number',
      value: studentData?.room_no || 'N/A',
      icon: HomeIcon,
    },
    {
      id: 'hostel',
      label: 'Hostel Number',
      value: studentData?.hostel_no || 'N/A',
      icon: Building,
    },
  ];

  const settingItems: SettingItem[] = [
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: Edit3,
      onPress: handleEditProfile,
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: Lock,
      onPress: handleChangePassword,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      onPress: handleNotifications,
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: Shield,
      onPress: handlePrivacy,
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      onPress: handleHelp,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: studentData?.profile_pic_url || getDefaultProfileImage(studentData?.gender)
            }}
            style={styles.profileImage}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>
              {studentData?.full_name || 'Student Name'}
            </Text>
            <View style={styles.verifiedBadge}>
              <Check size={12} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.profileRoll}>
            Roll No: {studentData?.roll_no || 'N/A'}
          </Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          {profileInfo.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <View
                key={item.id}
                style={[
                  styles.infoItem,
                  index === profileInfo.length - 1 && styles.lastInfoItem,
                ]}
              >
                <View style={styles.infoLeft}>
                  <IconComponent size={20} color={COLORS.primary} />
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
            );
          })}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          {settingItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
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
                  <IconComponent size={20} color={COLORS.primary} />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <View style={styles.chevron}>
                  <Text style={styles.chevronText}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.backgroundSecondary,
  },
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
    borderRadius: 9,
    backgroundColor: COLORS.info,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileRoll: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
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
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronText: {
    fontSize: 18,
    color: COLORS.gray,
    fontWeight: '300',
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