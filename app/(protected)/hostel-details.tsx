import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Listing from '../../components/ui/Listing';
import SubmitButton from '../../components/ui/SubmitButton';

// Hostel code mapping for parsing
const hostelCodeMap: { [key: number]: string } = {
  1: '1B',
  2: '2G',
  3: '3G',
  4: '4G',
  5: '5B',
  6: '6G',
  7: '7G',
  8: '8G',
  9: '9G',
  10: '10B',
  11: '11B',
  12: '12B',
  13: '13B',
  14: '14B',
  16: '16B',
};

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

        if (response.ok && data.success) {
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
      console.error('Error fetching student data:', error);
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

  const getFloor = (roomNo?: string | null): string => {
    if (!roomNo) return 'N/A';
    const firstDigit = parseInt(roomNo.charAt(0), 10);
    if (isNaN(firstDigit)) return 'N/A';
    return firstDigit === 1 ? 'Ground Floor' : `${firstDigit - 1}th Floor`;
  };

  const getHostelType = (hostelNo?: string | null): string => {
    if (!hostelNo) return 'N/A';
    return hostelNo.endsWith('B') ? 'Boys' : hostelNo.endsWith('G') ? 'Girls' : 'N/A';
  };

  const getHostelNumber = (hostelNo?: string | null): string => {
    if (!hostelNo) return 'Add';
    const hostelNumber = Object.keys(hostelCodeMap).find(
      (key) => hostelCodeMap[Number(key)] === hostelNo
    );
    return hostelNumber || hostelNo;
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

  if (!student.hostel_no) {
    return (
      <>
        <CustomHeader title="Hostel Details" showBackButton onBackPress={() => router.back()} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
          <View className="flex-1 items-center justify-center px-6 py-12 space-y-6">
            <View className="w-24 h-24 rounded-full border border-black flex items-center justify-center">
              <MaterialCommunityIcons name="office-building-outline" size={42} color="black" />
            </View>
            <Text className="text-[22px] font-semibold text-black text-center">
              No Hostel Linked
            </Text>
            <Text className="text-base text-gray-600 text-center leading-relaxed">
              You haven’t added your hostel yet. Tap below to add your hostel and start managing your account.
            </Text>
            <SubmitButton
              title="Add Your Hostel"
              onPress={() => router.push('/select-hostel')}
              icon="plus"
            />
          </View>
        </ScrollView>
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
        <Listing
          title="Accommodation Details"
          data={[
            {
              icon: <Feather name="home" size={20} color="#0D0D0D" />,
              label: 'Hostel Number',
              value: getHostelNumber(student.hostel_no),
            },
            {
              icon: <Feather name="home" size={20} color="#0D0D0D" />,
              label: 'Room Number',
              value: student.room_no ?? 'Add',
            },
            {
              icon: <MaterialCommunityIcons name="stairs" size={20} color="#0D0D0D" />,
              label: 'Floor',
              value: getFloor(student.room_no),
            },
            {
              icon: <MaterialCommunityIcons name="office-building" size={20} color="#0D0D0D" />,
              label: 'Hostel Type',
              value: getHostelType(student.hostel_no),
            },
            {
              icon: <Feather name="edit" size={20} color="#0D0D0D" />,
              label: 'Edit Hostel',
              showArrow: true,
              onPress: () => router.push({
                pathname: '/select-hostel',
                params: { edit: 'true' },
              }),
            },
          ]}
        />
        <Listing
          title="Warden Details"
          data={[
            {
              icon: <Feather name="phone-call" size={20} color="#0D0D0D" />,
              label: 'Amit Dangi',
              value: '+918210220189',
              onPress: () => Linking.openURL('tel:+918210220189'),
            },
            {
              icon: <Feather name="phone-call" size={20} color="#0D0D0D" />,
              label: 'Sonu',
              value: '+918210773252',
              onPress: () => Linking.openURL('tel:+918210773252'),
            },
          ]}
        />
        <Listing
          title="Quick Actions"
          data={[
            {
              icon: <MaterialCommunityIcons name="swap-horizontal" size={20} color="#0D0D0D" />,
              label: 'Request Room Change',
              showArrow: true,
              onPress: () =>
                Alert.alert('Coming soon', 'Request Room Change feature will be available soon.'),
            },
            {
              icon: <MaterialCommunityIcons name="tools" size={20} color="#0D0D0D" />,
              label: 'Report Maintenance Issue',
              showArrow: true,
              onPress: () =>
                Alert.alert('Coming soon', 'Report Maintenance feature will be available soon.'),
            },
            {
              icon: <MaterialCommunityIcons name="account-group" size={20} color="#0D0D0D" />,
              label: 'View Roommates',
              showArrow: true,
              onPress: () =>
                Alert.alert('Coming soon', 'View Roommates feature will be available soon.'),
            },
          ]}
        />
      </ScrollView>
    </>
  );
};

export default HostelDetails;