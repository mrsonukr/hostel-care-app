import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AppColors } from '../constants/colors';

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

  // Update time every second for live updates and debugging
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every 1 second (1000ms) for debugging

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

    // Hostel reopens at 6 AM (6 * 60 = 360 minutes)
    const reopenTimeInMinutes = 6 * 60; // 6:00 AM

    // Check if hostel is currently open
    // Hostel is open if: current time is between 6 AM and entry time
    const isCurrentlyOpen = currentTimeInMinutes >= reopenTimeInMinutes && currentTimeInMinutes < entryTimeInMinutes;

    if (isCurrentlyOpen) {
      // Hostel is open - show time until entry closes
      const remainingMinutes = entryTimeInMinutes - currentTimeInMinutes;
      const hrs = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      return {
        status: 'open',
        remainingTime: `${hrs > 0 ? `${hrs}h ` : ''}${mins}m left`,
        color: 'text-green-600'
      };
    } else {
      // Hostel is closed - calculate time until reopen
      let minutesUntilReopen;

      if (currentTimeInMinutes < reopenTimeInMinutes) {
        // It's before 6 AM, so reopen is today
        minutesUntilReopen = reopenTimeInMinutes - currentTimeInMinutes;
      } else {
        // It's past entry time, so reopen is tomorrow at 6 AM
        minutesUntilReopen = (24 * 60 - currentTimeInMinutes) + reopenTimeInMinutes;
      }

      const hrs = Math.floor(minutesUntilReopen / 60);
      const mins = minutesUntilReopen % 60;

      return {
        status: 'closed',
        remainingTime: `${hrs > 0 ? `${hrs}h ` : ''}${mins}m left`,
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
          {/* Icon with primary background */}
          <View className={`w-10 h-10 rounded-full ${AppColors.primary.background} justify-center items-center mr-3`}>
            <Feather 
              name="clock" 
              size={20} 
              color={AppColors.primary.icon}
            />
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-base font-semibold text-black font-okra mb-1">
              {entryTimeStatus.status === 'closed'
                ? `Hostel Entry Closed`
                : `Entry Allowed Till ${isFemale ? '8:00 PM' : '10:00 PM'}`
              }
            </Text>

            <Text className="text-sm text-gray-600 font-okra mb-2">
              {entryTimeStatus.status === 'closed'
                ? 'Reopens at 6:00 AM'
                : 'Late entry not allowed in Hostel'
              }
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
