import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Header } from '../components/Header'; // Assumes you have a reusable Header component
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

const mockNotifications = [
  {
    id: '1',
    title: 'Payment Successful',
    message: 'Your hostel fee payment of ₹5000 was successful.',
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'Profile Updated',
    message: 'Your profile information was updated.',
    time: '1 day ago',
  },
  {
    id: '3',
    title: 'New Announcement',
    message: 'Mid-term exams will start from 10th August.',
    time: '3 days ago',
  },
];

const NotificationScreen: React.FC = () => {
  const renderItem = ({ item }: { item: typeof mockNotifications[0] }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundTertiary} />
      <Header title="Notifications" />

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundTertiary,
  },
  listContent: {
    padding: SPACING.xxl,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 10,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notificationTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  notificationMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  notificationTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPlaceholder,
  },
});

export default NotificationScreen;
