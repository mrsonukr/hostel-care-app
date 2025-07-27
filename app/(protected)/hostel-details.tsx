import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';

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

const HostelDetails: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();

  const fetchStudentData = useCallback(async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (studentData) {
        const parsedData: Student = JSON.parse(studentData);
        setStudent(parsedData);

        const response = await fetch(
          `https://hostelapis.mssonutech.workers.dev/api/student/${parsedData.roll_no}`
        );
        const data = await response.json();

        if (response.status === 200 && data.success) {
          setStudent(data.student);
          await AsyncStorage.setItem('student', JSON.stringify(data.student));
        } else {
          console.warn('API error:', data.error);
          Alert.alert('Error', data.error || 'Failed to fetch latest data.');
        }
      } else {
        Alert.alert('Error', 'Please log in again.');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to load user data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStudentData();
  }, [fetchStudentData]);

  const getFloor = (roomNo?: string | null) => {
    if (!roomNo) return 'N/A';
    const firstDigit = parseInt(roomNo.charAt(0), 10);
    if (isNaN(firstDigit)) return 'N/A';
    return firstDigit === 1 ? 'Ground Floor' : `${firstDigit - 1}th Floor`;
  };

  const getHostelType = (hostelNo?: string | null) => {
    if (!hostelNo) return 'N/A';
    return `Hostel Block ${hostelNo}`;
  };

  if (loading) {
    return (
      <>
        <CustomHeader title="Hostel Details" showBackButton onBackPress={() => router.back()} />
        <View className="flex-1 bg-[#F2F2F7] justify-center items-center">
          <ActivityIndicator size="large" color="#0D0D0D" />
        </View>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <CustomHeader title="Hostel Details" showBackButton onBackPress={() => router.back()} />
        <View className="flex-1 justify-center items-center bg-[#F2F2F7]">
          <Text className="text-red-500 text-[18px] font-okra">No user data found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <CustomHeader title="Hostel Details" showBackButton onBackPress={() => router.back()} />
      <ScrollView
        className="flex-1 bg-[#F2F2F7]"
        contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D0D0D" />
        }
      >
        {/* Accommodation Details */}
        <View className="bg-white rounded-xl mb-5">
          <Text className="text-[16px] font-semibold font-okra text-black px-5 pt-5 pb-3">Accommodation Details</Text>

          <View className="flex-row justify-between items-center px-5 py-3 border-b border-[#E5E5EA]">
            <View className="flex-row items-center">
              <Feather name="home" size={20} color="#0D0D0D" />
              <Text className="text-[16px] text-black font-okra ml-3">Hostel Number</Text>
            </View>
            {student.hostel_no ? (
              <Text className="text-[16px] text-[#666] font-okra">{student.hostel_no}</Text>
            ) : (
              <TouchableOpacity onPress={() => Alert.alert('Coming soon', 'Hostel assignment feature will be available soon.')}>
                <Text className="text-[16px] text-black font-medium font-okra">Add</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row justify-between items-center px-5 py-3 border-b border-[#E5E5EA]">
            <View className="flex-row items-center">
              <Feather name="home" size={20} color="#0D0D0D" />
              <Text className="text-[16px] text-black font-okra ml-3">Room Number</Text>
            </View>
            {student.room_no ? (
              <Text className="text-[16px] text-[#666] font-okra">{student.room_no}</Text>
            ) : (
              <TouchableOpacity onPress={() => Alert.alert('Coming soon', 'Room assignment feature will be available soon.')}>
                <Text className="text-[16px] text-black font-medium font-okra">Add</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row justify-between items-center px-5 py-3 border-b border-[#E5E5EA]">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="stairs" size={20} color="#0D0D0D" />
              <Text className="text-[16px] text-black font-okra ml-3">Floor</Text>
            </View>
            <Text className="text-[16px] text-[#666] font-okra">{getFloor(student.room_no)}</Text>
          </View>

          <View className="flex-row justify-between items-center px-5 py-3">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="office-building" size={20} color="#0D0D0D" />
              <Text className="text-[16px] text-black font-okra ml-3">Hostel Type</Text>
            </View>
            <Text className="text-[16px] text-[#666] font-okra">{getHostelType(student.hostel_no)}</Text>
          </View>
        </View>

        {/* Status Section */}
        <View className="bg-white rounded-xl mb-5 px-5 py-4">
          <Text className="text-[16px] font-semibold font-okra text-black mb-3">Status</Text>
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons
              name={student.hostel_no && student.room_no ? 'check-circle' : 'clock-outline'}
              size={24}
              color={student.hostel_no && student.room_no ? '#4CAF50' : '#FF9800'}
            />
            <Text className="text-[16px] font-semibold font-okra text-black ml-3">
              {student.hostel_no && student.room_no ? 'Accommodation Assigned' : 'Pending Assignment'}
            </Text>
          </View>
          <Text className="text-[14px] text-[#666] font-okra leading-5 ml-9">
            {student.hostel_no && student.room_no
              ? `You are currently assigned to Room ${student.room_no} in Hostel ${student.hostel_no}`
              : 'Your hostel and room assignment is pending. Please contact the administration for updates.'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-xl mb-5">
          <Text className="text-[16px] font-semibold font-okra text-black px-5 pt-5 pb-3">Quick Actions</Text>

          {[
            {
              icon: 'swap-horizontal',
              label: 'Request Room Change',
            },
            {
              icon: 'tools',
              label: 'Report Maintenance Issue',
            },
            {
              icon: 'account-group',
              label: 'View Roommates',
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => Alert.alert('Coming soon', `${item.label} feature will be available soon.`)}
              className={`flex-row items-center px-5 py-3 border-b border-[#E5E5EA] ${index === 2 ? 'border-b-0' : ''}`}
            >
              <MaterialCommunityIcons name={item.icon as any} size={20} color="#0D0D0D" />
              <Text className="flex-1 text-[16px] text-black ml-3 font-okra">{item.label}</Text>
              <Feather name="chevron-right" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default HostelDetails;
