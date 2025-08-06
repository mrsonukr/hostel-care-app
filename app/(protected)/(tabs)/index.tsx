import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomHeader from '../../../components/CustomHeader';

interface Student {
  roll_no: string;
  full_name?: string;
  gender?: string;
  mobile_no?: string;
  email?: string;
  hostel_no?: string | null;
  room_no?: string | null;
  email_verified?: boolean;
  created_at?: string;
  profile_pic_url?: string | null;
}

export default function HomeTab() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (studentData) {
        setStudent(JSON.parse(studentData));
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudentData();
    setRefreshing(false);
  };

  const getDefaultProfileImage = (gender?: string) =>
    gender?.toLowerCase() === 'female'
      ? require('../../../assets/images/female.png')
      : require('../../../assets/images/male.png');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      icon: <Feather name="wifi" size={24} color="#3B82F6" />,
      title: "WiFi Info",
      subtitle: "Network details",
      color: "bg-blue-50"
    },
    {
      icon: <MaterialCommunityIcons name="food" size={24} color="#10B981" />,
      title: "Mess Menu",
      subtitle: "Today's food",
      color: "bg-green-50"
    },
    {
      icon: <Feather name="calendar" size={24} color="#F59E0B" />,
      title: "Events",
      subtitle: "Upcoming activities",
      color: "bg-yellow-50"
    },
    {
      icon: <Feather name="file-text" size={24} color="#8B5CF6" />,
      title: "Notices",
      subtitle: "Important updates",
      color: "bg-purple-50"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "Hostel Maintenance",
      message: "Scheduled maintenance in Block A on Saturday. Water supply will be affected from 9 AM to 2 PM.",
      time: "2 hours ago",
      type: "maintenance"
    },
    {
      id: 2,
      title: "New WiFi Network",
      message: "New high-speed WiFi network 'HostelCare_5G' is now available. Password: Hostel2024",
      time: "1 day ago",
      type: "info"
    },
    {
      id: 3,
      title: "Mess Menu Update",
      message: "This week's mess menu has been updated. Check the notice board for details.",
      time: "2 days ago",
      type: "food"
    }
  ];

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <MaterialCommunityIcons name="tools" size={20} color="#F59E0B" />;
      case 'info':
        return <Feather name="info" size={20} color="#3B82F6" />;
      case 'food':
        return <MaterialCommunityIcons name="food" size={20} color="#10B981" />;
      default:
        return <Feather name="bell" size={20} color="#6B7280" />;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <CustomHeader title="Home" />
      <ScrollView 
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D0D0D" />
        }
      >
        {/* Welcome Section */}
        <View className="bg-white rounded-2xl p-6 mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <Image
                source={
                  student?.profile_pic_url?.startsWith('http')
                    ? { uri: student.profile_pic_url }
                    : getDefaultProfileImage(student?.gender)
                }
                className="w-16 h-16 rounded-full"
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-black">
                {getGreeting()}, {student?.full_name?.split(' ')[0] || 'Student'}!
              </Text>
              <Text className="text-sm text-gray-600">
                Welcome back to HostelCare
              </Text>
            </View>
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
              <Feather name="sun" size={20} color="#3B82F6" />
            </View>
          </View>
          
          {/* Quick Stats */}
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-blue-50 rounded-xl p-3">
              <View className="flex-row items-center">
                <Feather name="home" size={16} color="#3B82F6" />
                <Text className="text-xs text-blue-600 ml-1 font-medium">Hostel</Text>
              </View>
              <Text className="text-lg font-bold text-blue-600 mt-1">
                {student?.hostel_no || 'N/A'}
              </Text>
            </View>
            <View className="flex-1 bg-green-50 rounded-xl p-3">
              <View className="flex-row items-center">
                <Feather name="hash" size={16} color="#10B981" />
                <Text className="text-xs text-green-600 ml-1 font-medium">Room</Text>
              </View>
              <Text className="text-lg font-bold text-green-600 mt-1">
                {student?.room_no || 'N/A'}
              </Text>
            </View>
            <View className="flex-1 bg-purple-50 rounded-xl p-3">
              <View className="flex-row items-center">
                <Feather name="check-circle" size={16} color="#8B5CF6" />
                <Text className="text-xs text-purple-600 ml-1 font-medium">Status</Text>
              </View>
              <Text className="text-lg font-bold text-purple-600 mt-1">
                Active
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-black mb-3 px-1">Quick Actions</Text>
          <View className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
                             <TouchableOpacity
                 key={index}
                 className={`${action.color} rounded-2xl p-4`}
               >
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center mb-3">
                  {action.icon}
                </View>
                <Text className="text-base font-semibold text-black mb-1">
                  {action.title}
                </Text>
                <Text className="text-xs text-gray-600">
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Announcements */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="text-lg font-semibold text-black">Announcements</Text>
            <TouchableOpacity>
              <Text className="text-sm text-blue-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          <View className="space-y-3">
            {announcements.map((announcement) => (
                             <View key={announcement.id} className="bg-white rounded-2xl p-4">
                <View className="flex-row items-start">
                  <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3 mt-1">
                    {getAnnouncementIcon(announcement.type)}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-base font-semibold text-black">
                        {announcement.title}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {announcement.time}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-700 leading-5">
                      {announcement.message}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Today's Schedule */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-black mb-3 px-1">Today's Schedule</Text>
          <View className="bg-white rounded-2xl p-4">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
                <Feather name="clock" size={16} color="#F59E0B" />
              </View>
              <Text className="text-base font-semibold text-black">Mess Timings</Text>
            </View>
            <View className="space-y-2">
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-600">Breakfast</Text>
                <Text className="text-sm font-medium text-black">7:00 AM - 9:00 AM</Text>
              </View>
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-600">Lunch</Text>
                <Text className="text-sm font-medium text-black">12:00 PM - 2:30 PM</Text>
              </View>
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-600">Dinner</Text>
                <Text className="text-sm font-medium text-black">7:00 PM - 9:30 PM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-3 px-1">Emergency Contacts</Text>
          <View className="bg-white rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                  <Feather name="phone" size={20} color="#EF4444" />
                </View>
                <View>
                  <Text className="text-base font-semibold text-black">Emergency</Text>
                  <Text className="text-sm text-gray-600">24/7 Support</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-red-50 px-4 py-2 rounded-lg">
                <Text className="text-sm font-medium text-red-600">Call Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
