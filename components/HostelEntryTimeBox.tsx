import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HostelEntryTimeBox() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userGender, setUserGender] = useState<string>('male');

  // Fetch user gender from AsyncStorage and refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserGender = async () => {
        try {
          const studentData = await AsyncStorage.getItem('student');
          if (studentData) {
            const parsedData = JSON.parse(studentData);
            setUserGender(parsedData.gender || 'male');
          }
        } catch (error) {
          console.error('Error fetching user gender:', error);
        }
      };

      fetchUserGender();
    }, [])
  );

  // Update time every 30 seconds for live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds (30000ms)

    return () => clearInterval(timer);
  }, []);

  // Get current time (device should already be in IST if user is in India)
  const getCurrentTimeInIST = () => {
    return currentTime; // Use device time directly since it should be in IST
  };

  const getEntryTimeStatus = () => {
    const now = getCurrentTimeInIST();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Entry time based on gender
    const entryTime = userGender === 'female' ? 20 : 22; // 8 PM for female, 10 PM for male/others
    const entryTimeInMinutes = entryTime * 60;

    if (currentTimeInMinutes < entryTimeInMinutes) {
      // Before entry time
      const remainingMinutes = entryTimeInMinutes - currentTimeInMinutes;
      const hrs = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      return {
        status: 'open',
        remainingTime: `${hrs > 0 ? `${hrs}h ` : ''}${mins}m left`,
        color: 'text-green-600'
      };
    } else {
      // After entry time
      return {
        status: 'closed',
        remainingTime: 'Entry time passed',
        color: 'text-red-600'
      };
    }
  };

  const entryTimeStatus = getEntryTimeStatus();
  const isFemale = userGender === 'female';

  return (
    <View className="mx-4 mb-6">
      {/* Parent Box */}
      <View className="bg-white rounded-2xl p-4">
        <View className="flex-row items-center">
          {/* Icon */}
          <View className="w-10 h-10 rounded-full bg-black justify-center items-center mr-3">
            <Feather name="clock" size={20} color="white" />
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-base font-semibold text-black font-okra mb-1">
              Entry Allowed Till {isFemale ? '8:00 PM' : '10:00 PM'}
            </Text>
            
            <Text className="text-sm text-gray-600 font-okra mb-2">
              Late entry not allowed
            </Text>
          </View>

          {/* Time Status - Right Side */}
          <View className="items-end">
            <Text className={`text-sm font-medium ${entryTimeStatus.color} font-okra`}>
              {entryTimeStatus.remainingTime}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
