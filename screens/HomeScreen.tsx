import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import type { HomeScreenProps, StudentData } from '../types/navigation';
import { COLORS, SPACING } from '../constants/colors';
import { HomeHeader } from '../components/home/HomeHeader';
import { WelcomeCard } from '../components/home/WelcomeCard';
import { ActionsList } from '../components/home/ActionsList';
import { BottomNavigation } from '../components/shared/BottomNavigation';

interface ActionItem {
  id: string;
  title: string;
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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  useEffect(() => {
    if (route?.params?.studentData) {
      setStudentData(route.params.studentData);
    }
  }, [route]);

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

  const handleRaiseComplaint = useCallback((): void => {
    Alert.alert('Feature', 'Raise Complaint feature coming soon!');
  }, []);

  const handleViewComplaintStatus = useCallback((): void => {
    Alert.alert('Feature', 'View Complaint Status feature coming soon!');
  }, []);

  const handleDiagnostics = useCallback((): void => {
    navigation.navigate('Notifications');
  }, []);

  const handleSettings = useCallback((): void => {
    navigation.navigate('Settings', { studentData });
  }, [navigation, studentData]);

  const actionItems: ActionItem[] = [
    {
      id: 'raise-complaint',
      title: 'Raise Complaint',
      icon: 'plus-circle',
      onPress: handleRaiseComplaint,
    },
    {
      id: 'view-status',
      title: 'View Complaint Status',
      icon: 'eye',
      onPress: handleViewComplaintStatus,
    },
  ];

  const navItems: NavItem[] = [
    {
      id: 'home',
      title: 'Home',
      icon: 'home',
      onPress: () => {},
      active: true,
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
      onPress: handleSettings,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <HomeHeader onLogout={handleLogout} />

      <View style={styles.content}>
        <WelcomeCard />
        <ActionsList actions={actionItems} />
      </View>

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
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.backgroundSecondary,
  },
});

export default HomeScreen;