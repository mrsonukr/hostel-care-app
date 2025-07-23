import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Header } from '../components/Header';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';
import { BottomNavigation } from '../components/shared/BottomNavigation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type NotificationScreenProps = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const mockNotifications = [
  {
    id: '1',
    title: 'Payment Successful',
    message: 'Your hostel fee payment of ₹5000 was successful.',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    title: 'Profile Updated',
    message: 'Your profile information was updated successfully.',
    time: '1 day ago',
    isRead: true,
  },
  {
    id: '3',
    title: 'New Announcement',
    message: 'Mid-term exams will start from 10th August. Please prepare accordingly.',
    time: '3 days ago',
    isRead: true,
  },
  {
    id: '4',
    title: 'Complaint Status Update',
    message: 'Your complaint #12345 has been resolved. Thank you for your patience.',
    time: '5 days ago',
    isRead: false,
  },
  {
    id: '5',
    title: 'Maintenance Notice',
    message: 'Water supply will be interrupted tomorrow from 10 AM to 2 PM.',
    time: '1 week ago',
    isRead: true,
  },
];

const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const renderItem = ({ item }: { item: typeof mockNotifications[0] }) => (
    <View style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  const navItems = [
    {
      id: 'home',
      title: 'Home',
      icon: 'home' as const,
      onPress: handleHome,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell' as const,
      onPress: () => {},
      active: true,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings' as const,
      onPress: handleSettings,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundTertiary} />
      
      <Header title="Notifications" onBackPress={handleGoBack} />

      <View style={styles.content}>
        <FlatList
          data={mockNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    backgroundColor: COLORS.backgroundSecondary,
  },
  listContent: {
    padding: SPACING.xl,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  notificationTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  notificationMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPlaceholder,
  },
});

export default NotificationScreen;