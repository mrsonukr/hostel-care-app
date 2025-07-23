import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { HomeScreenProps, StudentData } from '../types/navigation';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

interface ActionItem {
  id: string;
  title: string;
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
    Alert.alert('Feature', 'Diagnostics feature coming soon!');
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
      id: 'diagnostics',
      title: 'Diagnostics',
      icon: 'activity',
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

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="home" size={24} color={COLORS.primary} />
          <Text style={styles.headerTitle}>HostelCare</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <Feather name="log-out" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Welcome to your HostelCare dashboard. Manage your complaints and
            issues easily.
          </Text>
        </View>

        <View style={styles.actionsList}>
          {actionItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.actionItem,
                index === actionItems.length - 1 && styles.lastActionItem,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.actionContent}>
                <View style={styles.actionIcon}>
                  <Feather name={item.icon} size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.actionTitle}>{item.title}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.backgroundSecondary,
  },
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
  actionsList: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  lastActionItem: {
    borderBottomWidth: 0,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '400',
    color: COLORS.text,
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

export default HomeScreen;