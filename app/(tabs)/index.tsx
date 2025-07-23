import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Chrome as HomeIcon, CirclePlus as PlusCircle, Eye, LogOut } from 'lucide-react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

interface ActionItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
}

export default function HomeScreen() {
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

  const handleRaiseComplaint = useCallback((): void => {
    Alert.alert('Feature', 'Raise Complaint feature coming soon!');
  }, []);

  const handleViewComplaintStatus = useCallback((): void => {
    Alert.alert('Feature', 'View Complaint Status feature coming soon!');
  }, []);

  const actionItems: ActionItem[] = [
    {
      id: 'raise-complaint',
      title: 'Raise Complaint',
      icon: PlusCircle,
      onPress: handleRaiseComplaint,
    },
    {
      id: 'view-status',
      title: 'View Complaint Status',
      icon: Eye,
      onPress: handleViewComplaintStatus,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <HomeIcon size={24} color={COLORS.primary} />
          <Text style={styles.headerTitle}>HostelCare</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <LogOut size={22} color={COLORS.primary} />
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
          {actionItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
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
                    <IconComponent size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.actionTitle}>{item.title}</Text>
                </View>
                <View style={styles.chevron}>
                  <Text style={styles.chevronText}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronText: {
    fontSize: 18,
    color: COLORS.gray,
    fontWeight: '300',
  },
});