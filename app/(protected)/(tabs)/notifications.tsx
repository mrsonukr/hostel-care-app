import { StyleSheet, Text, View, ScrollView, RefreshControl, Pressable } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { useState } from 'react';

const initialNotifications = [
  {
    id: 1,
    expoNotificationId: 'expo-notification-001',
    complaintId: 'COMP-2024-001',
    title: 'Water Issue in Room 205',
    description: 'No water supply in bathroom since morning. Please check the plumbing.',
    status: 'in_progress',
    statusText: 'In Progress',
    date: 'Today',
    time: '10:30 AM',
    read: false,
  },
  {
    id: 2,
    expoNotificationId: 'expo-notification-002',
    complaintId: 'COMP-2024-002',
    title: 'Electrical Problem - Room 312',
    description: 'Power socket not working properly. Need immediate attention.',
    status: 'resolved',
    statusText: 'Resolved',
    date: 'Today',
    time: '2:15 PM',
    read: true,
  },
  {
    id: 3,
    expoNotificationId: 'expo-notification-003',
    complaintId: 'COMP-2024-003',
    title: 'Cleaning Request - Common Area',
    description: 'Common area needs cleaning. Trash bins are full.',
    status: 'rejected',
    statusText: 'Rejected',
    date: 'Yesterday',
    time: '9:45 AM',
    read: false,
  },
  {
    id: 4,
    expoNotificationId: 'expo-notification-004',
    complaintId: 'COMP-2024-004',
    title: 'WiFi Connectivity Issue',
    description: 'Internet connection is very slow in room 401. Cannot study properly.',
    status: 'pending',
    statusText: 'Pending',
    date: '12 Aug, 2025',
    time: '11:20 AM',
    read: false,
  },
  {
    id: 5,
    expoNotificationId: 'expo-notification-005',
    complaintId: 'COMP-2024-005',
    title: 'Plumbing Problem - Bathroom',
    description: 'Water leakage from ceiling in bathroom. Urgent repair needed.',
    status: 'resolved',
    statusText: 'Resolved',
    date: '12 Aug, 2025',
    time: '4:30 PM',
    read: true,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⏳' };
    case 'in_progress':
      return { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔄' };
    case 'resolved':
      return { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' };
    case 'rejected':
      return { bg: 'bg-red-100', text: 'text-red-700', icon: '❌' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📋' };
  }
};

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [pressedId, setPressedId] = useState<number | null>(null);

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);

  const handleNotificationPress = (notificationId: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);

    // Simulate API call or data refresh
    setTimeout(() => {
      // You can add actual API call here to fetch new notifications
      setRefreshing(false);
    }, 1000);
  };

  return (
    <>
      <CustomHeader title="Notifications" />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#000000']} // Black color for Android
            tintColor="#000000" // Black color for iOS
          />
        }
      >
        {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
          <View key={date}>
            <View className="w-full px-4 py-2">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                {date}
              </Text>
            </View>

            {dateNotifications.map((item, index) => {
              const statusColors = getStatusColor(item.status);
              const isLastItem = index === dateNotifications.length - 1;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleNotificationPress(item.id)}
                  className={`w-full px-4 ${!item.read ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <View>
                    <View className="flex-row py-4">
                      {/* Status Icon */}
                      <View className={`w-12 h-12 items-center justify-center rounded-full ${statusColors.bg} mr-4`}>
                        <Text className="text-xl">
                          {statusColors.icon}
                        </Text>
                      </View>

                      {/* Content */}
                      <View className="flex-1">
                        {/* Title and Time */}
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className={`text-base font-semibold ${!item.read ? 'text-gray-900' : 'text-gray-800'}`}>
                            {item.title}
                          </Text>
                        </View>

                        {/* Description */}
                        <Text className={`text-sm ${!item.read ? 'text-gray-700' : 'text-gray-600'} mb-2 leading-5`}>
                          {item.description}
                        </Text>

                        {/* Date and Time */}
                        <View className="flex-row items-center justify-between">
                          <Text className={`text-xs ${!item.read ? 'text-gray-600' : 'text-gray-500'}`}>
                            {item.date} • {item.time}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Bottom border - only if not last item */}
                    {!isLastItem && <View className="border-b border-gray-200 ml-16" />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
