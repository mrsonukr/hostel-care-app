import { StyleSheet, Text, View, ScrollView, RefreshControl, Pressable, Image, Linking, Alert, ActivityIndicator } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { getNotifications, markNotificationAsRead, deleteMultipleNotifications, type Notification, type NotificationsResponse } from '../../../utils/notificationsApi';
import { notificationEvents, NOTIFICATION_EVENTS } from '../../../utils/notificationEvents';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Remove initial notifications - will fetch from API

// Group header label (Today / Yesterday / Normal Date)
const formatDateGroup = (timestamp: string) => {
  // Parse the timestamp - API sends "2025-09-06 20:55:28" which is in UTC
  // Convert UTC to IST (UTC+5:30)
  const utcDate = new Date(timestamp + 'Z'); // Add Z to indicate UTC
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    istDate.getDate() === today.getDate() &&
    istDate.getMonth() === today.getMonth() &&
    istDate.getFullYear() === today.getFullYear();

  const isYesterday =
    istDate.getDate() === yesterday.getDate() &&
    istDate.getMonth() === yesterday.getMonth() &&
    istDate.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return istDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Relative time like 1 sec ago, 2 hours ago
const formatRelativeTime = (timestamp: string) => {
  // Parse the timestamp - API sends "2025-09-06 20:55:28" which is in UTC
  const utcDate = new Date(timestamp + 'Z'); // Add Z to indicate UTC
  
  // Get current time
  const now = new Date();
  
  // Calculate difference in milliseconds
  const diffMs = now.getTime() - utcDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return `${diffSec <= 1 ? 1 : diffSec} sec ago`;
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
};

function NotificationsTabContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [student, setStudent] = useState<any>(null);
  const router = useRouter();

  const PAGE_SIZE = 10;

  // Fetch student data and notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get student data from AsyncStorage
        const studentData = await AsyncStorage.getItem('student');
        if (studentData) {
          const parsedStudent = JSON.parse(studentData);
          setStudent(parsedStudent);
          
          // Fetch notifications (first page)
          await fetchNotifications(parsedStudent.roll_no, 0, true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for push notifications to auto-refresh
    const notificationListener = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log('Push notification received, refreshing notifications...');
      // Refresh notifications when push notification is received
      if (student?.roll_no) {
        // Reset pagination and load first page
        setCurrentPage(0);
        setHasMore(true);
        await fetchNotifications(student.roll_no, 0, true);
      }
    });

    return () => {
      notificationListener.remove();
    };
  }, [student?.roll_no]);

  // Update badge count when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadCount = notifications.filter(n => !n.read).length;
      notificationEvents.emit(NOTIFICATION_EVENTS.UNREAD_COUNT_CHANGED, unreadCount);
    }
  }, [notifications]);

  // Fetch notifications from API with pagination
  const fetchNotifications = async (rollNo: string, page: number = 0, isRefresh: boolean = false) => {
    try {
      const offset = page * PAGE_SIZE;
      const response = await getNotifications(rollNo, PAGE_SIZE, offset);
      
      if (response.success) {
        const newNotifications = isRefresh || page === 0 ? response.data : [...notifications, ...response.data];
        
        if (isRefresh || page === 0) {
          // For refresh or first load, replace all notifications
          setNotifications(response.data);
        } else {
          // For pagination, append new notifications
          setNotifications(prev => [...prev, ...response.data]);
        }
        
        // Update pagination state
        setTotalNotifications(response.pagination.total);
        setCurrentPage(page);
        
        // Calculate hasMore based on total loaded notifications vs total available
        // Since backend total count is unreliable, we'll check if we got a full page
        const hasMoreData = response.data.length === PAGE_SIZE && response.data.length > 0;
        
        setHasMore(hasMoreData);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Load more notifications (for infinite scroll)
  const loadMoreNotifications = useCallback(async () => {
    if (loadingMore || !hasMore || !student?.roll_no) return;
    
    setLoadingMore(true);
    try {
      await fetchNotifications(student.roll_no, currentPage + 1, false);
    } catch (error) {
      console.error('Error loading more notifications:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, student?.roll_no, currentPage]);

  // Group notifications by date (Today/Yesterday/Date)
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = formatDateGroup(notification.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const handleNotificationPress = async (notification: Notification) => {
    // Mark notification as read via API
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
        );
        // Emit event to update tab badge
        notificationEvents.emit(NOTIFICATION_EVENTS.NOTIFICATION_READ);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate based on notification channel
    if (notification.channel === 'complaint_status' && notification.complaintId) {
      // Convert complaintId to number if it's a string
      const complaintId = typeof notification.complaintId === 'string' 
        ? parseInt(notification.complaintId) 
        : notification.complaintId;
      router.push(`/complaint-details?id=${complaintId}`);
    } else if (notification.channel === 'promotion' && notification.externalLink) {
      // Open external link for promotional notifications
      try {
        await Linking.openURL(notification.externalLink);
      } catch (error) {
        console.error('Error opening external link:', error);
      }
    }
    // Missing product notifications - no navigation, just mark as read
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (student?.roll_no) {
      // Reset pagination state
      setCurrentPage(0);
      setHasMore(true);
      await fetchNotifications(student.roll_no, 0, true);
      // Emit event to refresh badge count
      notificationEvents.emit(NOTIFICATION_EVENTS.UNREAD_COUNT_CHANGED, notifications.filter(n => !n.read).length);
    }
    setRefreshing(false);
  };

  // Handle long press to enter selection mode
  const handleLongPress = (notificationId: number) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      // Haptic feedback when entering selection mode
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleNotificationSelection(notificationId);
  };

  // Toggle notification selection
  const toggleNotificationSelection = (notificationId: number) => {
    setSelectedNotifications(prev => {
      const newSelection = prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId];

      // If no notifications selected, exit selection mode
      if (newSelection.length === 0) {
        setIsSelectionMode(false);
      }

      return newSelection;
    });
  };

  // Handle notification press (normal tap)
  const handleNotificationTap = (notification: any) => {
    if (isSelectionMode) {
      toggleNotificationSelection(notification.id);
    } else {
      handleNotificationPress(notification);
    }
  };

  // Delete selected notifications
  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) return;

    Alert.alert(
      'Delete Notifications',
      `Are you sure you want to delete ${selectedNotifications.length} notification${selectedNotifications.length > 1 ? 's' : ''}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMultipleNotifications(selectedNotifications);
              setNotifications(prev => 
                prev.filter(notification => !selectedNotifications.includes(notification.id))
              );
              // Emit events for each deleted notification
              selectedNotifications.forEach(() => {
                notificationEvents.emit(NOTIFICATION_EVENTS.NOTIFICATION_DELETED);
              });
              setSelectedNotifications([]);
              setIsSelectionMode(false);
            } catch (error) {
              console.error('Error deleting notifications:', error);
              Alert.alert('Error', 'Failed to delete notifications. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Cancel selection mode
  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedNotifications([]);
  };

  if (loading) {
    return (
      <>
        <CustomHeader title="Notifications" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Loading notifications...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <CustomHeader 
        title={isSelectionMode ? `${selectedNotifications.length} selected` : "Notifications"}
        showBackButton={isSelectionMode}
        onBackPress={isSelectionMode ? cancelSelection : undefined}
        showCancelText={isSelectionMode}
        rightComponent={
          isSelectionMode ? (
            <Pressable 
              onPress={handleDeleteSelected}
              disabled={selectedNotifications.length === 0}
            >
              <Text className={`font-medium ${selectedNotifications.length === 0 ? 'text-gray-400' : 'text-red-600'}`}>
                Delete
              </Text>
            </Pressable>
          ) : null
        }
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#000000']}
            tintColor="#000000"
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
          
          if (isCloseToBottom && hasMore && !loadingMore) {
            loadMoreNotifications();
          }
        }}
        scrollEventThrottle={16}
      >
        {notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="notifications-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg font-medium mt-4">No notifications</Text>
            <Text className="text-gray-400 text-sm mt-2 text-center px-8">
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
          <View key={date}>
            {/* Group header */}
            <View className="w-full px-4 py-2">
              <View className="flex-row items-center">
                <Text className="text-lg font-semibold text-gray-500 mr-3">{date}</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>
            </View>

            {/* Notifications */}
            {dateNotifications.map((item) => {
              const relativeTime = formatRelativeTime(item.created_at);

              const isSelected = selectedNotifications.includes(item.id);

              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleNotificationTap(item)}
                  onLongPress={() => handleLongPress(item.id)}
                  className={`w-full px-4 ${isSelected ? 'bg-red-50' : !item.read ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <View className="flex-row py-4">
                    {/* Dynamic Icon based on channel */}
                    <View className={`w-12 h-12 items-center justify-center rounded-full mr-4 ${isSelectionMode && isSelected ? 'bg-red-500' :
                      item.channel === 'complaint_status' ? 'bg-purple-100' :
                        item.channel === 'missing_product' ? 'bg-orange-100' :
                          item.channel === 'promotion' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                      {isSelectionMode && isSelected ? (
                        <Ionicons name="checkmark" size={20} color="white" />
                      ) : item.channel === 'complaint_status' ? (
                        <Ionicons name="document-text-outline" size={20} color="black" />
                      ) : item.channel === 'missing_product' ? (
                        <Ionicons name="search-outline" size={20} color="black" />
                      ) : item.channel === 'promotion' ? (
                        <Ionicons name="megaphone-outline" size={20} color="black" />
                      ) : (
                        <Ionicons name="notifications-outline" size={20} color="black" />
                      )}
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <Text
                        className={`text-base font-semibold ${!item.read ? 'text-gray-900' : 'text-gray-800'
                          }`}
                      >
                        {item.title}
                      </Text>

                      <Text
                        className={`text-sm ${!item.read ? 'text-gray-700' : 'text-gray-600'
                          } mb-2 leading-5`}
                      >
                        {item.description}
                        <Text
                          className={`text-xs ${!item.read ? 'text-gray-600' : 'text-gray-500'
                            } ml-2`}
                        >
                          {' • '}{relativeTime}
                        </Text>
                      </Text>
                    </View>

                    {/* Image Section */}
                    {item.image && (
                      <View className="ml-3">
                        <Image
                          source={{ uri: item.image }}
                          className="w-16 h-16 rounded-lg border-[.5px] border-gray-300"
                          resizeMode="cover"
                        />
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))
        )}
        
        
        {/* Loading more indicator */}
        {loadingMore && (
          <View className="py-4 items-center">
            <ActivityIndicator size="small" color="#000000" />
            <Text className="text-gray-500 text-sm mt-2">Loading more notifications...</Text>
          </View>
        )}
        
        {/* End of list indicator */}
        {!hasMore && notifications.length > 0 && (
          <View className="py-4 items-center">
            <Text className="text-gray-400 text-sm">You've reached the end of notifications</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { paddingBottom: 20 },
});

export default NotificationsTabContent;
