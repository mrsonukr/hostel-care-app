import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  isHomeHeader?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  isHomeHeader = false,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const local = await AsyncStorage.getItem('student');
        if (local) {
          const parsed = JSON.parse(local);
          setStudent(parsed);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (isHomeHeader) {
      fetchStudentData();
    }
  }, [isHomeHeader]);

  const getDefaultProfileImage = (gender?: string) =>
    gender?.toLowerCase() === 'female'
      ? require('../assets/images/female.png')
      : require('../assets/images/male.png');

  return (
    <View
      className="bg-white"
      style={{
        // iOS: Use insets.top for proper safe area handling
        // Android: No additional padding needed as StatusBar handles it
        paddingTop: Platform.OS === 'ios' ? insets.top : 0,
        marginTop: 0,
      }}
    >
      <View className={`flex-row items-center justify-between px-4 ${isHomeHeader ? 'h-16' : 'h-11'}`}>
        {isHomeHeader ? (
          <>
            <Text className="text-2xl font-bold text-black">
              HostelCare
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/(protected)/(tabs)/settings')}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View className="w-12 h-12 justify-center items-center border-2 border-gray-300 rounded-full">
                <Image 
                  source={
                    student?.profile_pic_url?.startsWith('http')
                      ? { uri: student.profile_pic_url }
                      : getDefaultProfileImage(student?.gender)
                  }
                  className="w-12 h-12 rounded-full"
                />
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {showBackButton ? (
              <TouchableOpacity
                onPress={onBackPress}
                className="w-8 h-8 justify-center items-start"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color="#000000" />
              </TouchableOpacity>
            ) : (
              <View className="w-8 h-8" />
            )}

            <Text
              numberOfLines={1}
              className="flex-1 text-center mx-4 text-lg font-semibold text-black"
            >
              {title}
            </Text>

            <View className="w-8" />
          </>
        )}
      </View>
    </View>
  );
};

export default CustomHeader;
