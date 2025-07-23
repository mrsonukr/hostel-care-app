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
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { SettingsScreenProps, StudentData } from '../types/navigation';
import { capitalizeFirst } from '../utils/validation';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

interface InfoItem {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  showWarning?: boolean;
}

interface SettingItem {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}

interface NavItem {
  id: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  active?: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
  const studentData: StudentData | undefined = route?.params?.studentData;

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
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          }),
      },
    ]);
  }, [navigation]);

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

  const handleHome = useCallback((): void => {
    navigation.navigate('Home', { studentData });
  }, [navigation, studentData]);

  const handleDiagnostics = useCallback((): void => {
    Alert.alert('Feature', 'Diagnostics feature coming soon!');
  }, []);

  const profileInfo: InfoItem[] = [
    {
      id: 'name',
      label: 'Full Name',
      value: studentData?.full_name || 'N/A',
      icon: 'user',
    },
    {
      id: 'phone',
      label: 'Mobile Number',
      value: studentData?.mobile_no || 'N/A',
      icon: 'phone',
    },
    {
      id: 'email',
      label: 'Email',
      value: studentData?.email || 'N/A',
      icon: 'mail',
      showWarning: studentData?.email_verified !== 1,
    },
    {
      id: 'gender',
      label: 'Gender',
      value: capitalizeFirst(studentData?.gender || ''),
      icon: studentData?.gender === 'female' ? 'user-x' : 'user-check',
    },
    ...(studentData?.room_no ? [{
      id: 'room',
      label: 'Room Number',
      value: studentData.room_no,
      icon: 'home' as const,
    }] : []),
    ...(studentData?.hostel_no ? [{
      id: 'hostel',
      label: 'Hostel Number',
      value: studentData.hostel_no,
      icon: 'building' as const,
    }] : []),
  ];

  const settingItems: SettingItem[] = [
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: 'edit-3',
      onPress: handleEditProfile,
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: 'lock',
      onPress: handleChangePassword,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'bell',
      onPress: handleNotifications,
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: 'shield',
      onPress: handlePrivacy,
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'help-circle',
      onPress: handleHelp,
    },
  ];

  const navItems: NavItem[] = [
    {
      id: 'home',
      title: 'Home',
      icon: 'home',
      onPress: handleHome,
    },
    {
      id: 'diagnostics',
      title: 'Diagnostics',
      icon: 'activity',
      onPress: handleDiagnostics,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      onPress: () => {},
      active: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
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
              <Feather name="check" size={12} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.profileRoll}>
            Roll No: {studentData?.roll_no || 'N/A'}
          </Text>
        </View>

        {/* Profile Information */}
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

        {/* Account Settings */}
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

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Feather
              name={item.icon}
              size={24}
              color={item.active ? COLORS.primary : COLORS.textTertiary}
            />
            <Text
              style={[
                styles.navText,
                item.active && styles.activeNavText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
  bottomNavigation: {
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xl,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xs : SPACING.xs,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  navText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  activeNavText: {
    color: COLORS.primary,
  },
});

export default SettingsScreen;