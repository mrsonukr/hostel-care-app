import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StudentData, RootStackParamList } from '../types/navigation';
import { COLORS, SPACING } from '../constants/colors';
import { capitalizeFirst } from '../utils/validation';
import { SettingsHeader } from '../components/settings/SettingsHeader';
import { ProfileSection } from '../components/settings/ProfileSection';
import { ProfileInfoSection } from '../components/settings/ProfileInfoSection';
import { AccountSettingsSection } from '../components/settings/AccountSettingsSection';
import { LogoutSection } from '../components/settings/LogoutSection';
import { BottomNavigation } from '../components/shared/BottomNavigation';

// ------------------ Types -------------------

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

interface InfoItem {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof import('@expo/vector-icons').Feather.glyphMap;
  showWarning?: boolean;
}

interface SettingItem {
  id: string;
  label: string;
  icon: keyof typeof import('@expo/vector-icons').Feather.glyphMap;
  onPress: () => void;
}

interface NavItem {
  id: string;
  title: string;
  icon: keyof typeof import('@expo/vector-icons').Feather.glyphMap;
  onPress: () => void;
  active?: boolean;
}

// ------------------ Component -------------------

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
  const studentData = route.params?.studentData;

  const getDefaultProfileImage = useCallback((gender?: string): string => {
    return gender === 'female'
      ? 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
      : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400';
  }, []);

  const handleLogout = useCallback(() => {
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

  const handleEditProfile = useCallback(() => {
    Alert.alert('Feature', 'Edit Profile feature coming soon!');
  }, []);

  const handleChangePassword = useCallback(() => {
    Alert.alert('Feature', 'Change Password feature coming soon!');
  }, []);

  const handleNotifications = useCallback(() => {
    Alert.alert('Feature', 'Notifications settings coming soon!');
  }, []);

  const handlePrivacy = useCallback(() => {
    Alert.alert('Feature', 'Privacy & Security settings coming soon!');
  }, []);

  const handleHelp = useCallback(() => {
    Alert.alert('Feature', 'Help & Support coming soon!');
  }, []);

  const handleHome = useCallback(() => {
    navigation.navigate('Home', studentData ? { studentData } : {});
  }, [navigation, studentData]);


  const handleDiagnostics = useCallback(() => {
    navigation.navigate('Notifications');
  }, []);

  const handleSettingsPress = useCallback(() => { }, []);

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
    ...(studentData?.room_no
      ? [
        {
          id: 'room',
          label: 'Room Number',
          value: studentData.room_no,
          icon: 'home' as keyof typeof import('@expo/vector-icons').Feather.glyphMap,
        },
      ]
      : []),
    ...(studentData?.hostel_no
      ? [
        {
          id: 'hostel',
          label: 'Hostel Number',
          value: studentData.hostel_no,
          icon: 'building' as keyof typeof import('@expo/vector-icons').Feather.glyphMap,
        },
      ]
      : []),

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
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell',
      onPress: handleDiagnostics,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      onPress: handleSettingsPress,
      active: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <SettingsHeader />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileSection 
          studentData={studentData} 
          getDefaultProfileImage={getDefaultProfileImage} 
        />
        
        <ProfileInfoSection profileInfo={profileInfo} />
        
        <AccountSettingsSection settingItems={settingItems} />
        
        <LogoutSection onLogout={handleLogout} />
      </ScrollView>

      <BottomNavigation items={navItems} />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.backgroundSecondary,
  },
});

export default SettingsScreen;