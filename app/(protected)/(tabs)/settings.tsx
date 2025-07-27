import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

type SettingsRoute =
  | '/(protected)/editprofile'
  | '/(protected)/hostel-details'
  | '/';

const settingsItems: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  route?: SettingsRoute;
}[] = [
    { icon: 'user', label: 'Profile Information', route: '/(protected)/editprofile' },
    { icon: 'home', label: 'Hostel Details', route: '/(protected)/hostel-details' },
    { icon: 'lock', label: 'Change Password' },
    { icon: 'bell', label: 'Notifications' },
    { icon: 'file-text', label: 'Privacy Policy' },
    { icon: 'help-circle', label: 'Help & Support' },
  ];

const Settings: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchStudentData = useCallback(async () => {
    try {
      const local = await AsyncStorage.getItem('student');
      if (!local) {
        Alert.alert('Error', 'Please log in again.');
        return router.replace('/(auth)/login');
      }

      const parsed: Student = JSON.parse(local);
      setStudent(parsed);

      const res = await fetch(`https://hostelapis.mssonutech.workers.dev/api/student/${parsed.roll_no}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setStudent(data.student);
        await AsyncStorage.setItem('student', JSON.stringify(data.student));
      } else {
        Alert.alert('Error', data.error || 'Could not fetch profile.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudentData();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('student');
          router.dismissAll();
          router.replace('/');
        },
      },
    ]);
  };

  const getDefaultProfileImage = (gender?: string) =>
    gender?.toLowerCase() === 'female'
      ? require('../../../assets/images/female.png')
      : require('../../../assets/images/male.png');

  const SkeletonLoader = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 0, duration: 800, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }, []);
    const opacity = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });
    return <Animated.View className="w-[60px] h-[60px] rounded-2xl bg-gray-300" style={{ opacity }} />;
  };

  if (loading) {
    return (
      <>
        <CustomHeader title="Settings" />
        <View className="flex-1 bg-white justify-center items-center">
          <ActivityIndicator size="large" color="#0D0D0D" />
        </View>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <CustomHeader title="Settings" />
        <View className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-red-500">No user data found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <CustomHeader title="Settings" />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D0D0D" />}
      >
        {/* Profile Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-[60px] h-[60px] rounded-2xl overflow-hidden mr-4 relative justify-center items-center">
                {imageLoading && <SkeletonLoader />}
                <Image
                  source={
                    student.profile_pic_url?.startsWith('http')
                      ? { uri: student.profile_pic_url }
                      : getDefaultProfileImage(student.gender)
                  }
                  className="w-[60px] h-[60px] rounded-2xl absolute"
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  style={{ opacity: imageLoading ? 0 : 1 }}
                />
              </View>
              <View>
                <View className="flex-row items-center mb-1">
                  <Text className="text-xl font-semibold text-black mr-2">
                    {student.full_name || 'Student Name'}
                  </Text>
                  <MaterialCommunityIcons name="check-decagram" size={20} color="#1DA1F2" />
                </View>
                <Text className="text-sm font-okra text-gray-500">Roll No: {student.roll_no}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <Feather name="log-out" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Menu */}
        <View>
          {settingsItems.map(({ icon, label, route }, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row items-center justify-between py-5"
              onPress={
                route ? () => router.push(route) : () => Alert.alert('Feature coming soon')
              }
            >
              <View className="flex-row items-center">
                <Feather name={icon} size={22} color="#0D0D0D" />
                <Text className="ml-4 font-okra text-lg text-black">{label}</Text>
              </View>
              <Feather name="chevron-right" size={22} color="#000" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default Settings;
