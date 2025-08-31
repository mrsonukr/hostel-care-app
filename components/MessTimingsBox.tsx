import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function MessTimingsBox() {
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

  // Update time every minute for live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute (60000ms)

    return () => clearInterval(timer);
  }, []);

  // Get current time in IST (India Standard Time)
  const getCurrentTimeInIST = () => {
    const now = currentTime;
    // IST is UTC+5:30
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const istTime = new Date(utcTime + istOffset);
    return istTime;
  };

  const getCurrentTimeProgress = (startTime: string, endTime: string) => {
    const now = getCurrentTimeInIST(); // Use IST time
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const parseTime = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour = hours;

      if (period === 'PM' && hours !== 12) hour += 12;
      if (period === 'AM' && hours === 12) hour = 0;

      return hour * 60 + minutes;
    };

    let startMinutes = parseTime(startTime);
    let endMinutes = parseTime(endTime);

    if (endMinutes < startMinutes) {
      if (currentTimeInMinutes >= startMinutes) {
        endMinutes += 24 * 60;
      } else {
        startMinutes += 24 * 60;
        endMinutes += 24 * 60;
      }
    }

    let remainingMinutes = 0;

    if (currentTimeInMinutes < startMinutes) {
      return { progress: 0, remainingMinutes: startMinutes - currentTimeInMinutes };
    } else if (currentTimeInMinutes > endMinutes) {
      return { progress: 100, remainingMinutes: 0 };
    } else {
      const totalDuration = endMinutes - startMinutes;
      const elapsed = currentTimeInMinutes - startMinutes;
      remainingMinutes = endMinutes - currentTimeInMinutes;
      return { progress: (elapsed / totalDuration) * 100, remainingMinutes };
    }
  };

  const messTimings = [
    { meal: 'Breakfast', time: '7:00 AM - 8:30 AM', startTime: '7:00 AM', endTime: '8:30 AM', icon: 'sunrise' },
    { meal: 'Lunch', time: '12:00 PM - 2:00 PM', startTime: '12:00 PM', endTime: '2:00 PM', icon: 'sun' },
    { meal: 'Snacks', time: '4:30 PM - 5:00 PM', startTime: '4:30 PM', endTime: '5:00 PM', icon: 'coffee' },
    { 
      meal: 'Dinner', 
      time: userGender === 'female' ? '7:00 PM - 7:40 PM' : '7:30 PM - 8:30 PM', 
      startTime: userGender === 'female' ? '7:00 PM' : '7:30 PM', 
      endTime: userGender === 'female' ? '7:40 PM' : '8:30 PM', 
      icon: 'moon' 
    }
  ];

  return (
    <View className="mx-4 mb-6">
      {/* Parent Box */}
      <View className="bg-white rounded-2xl p-4">
        <Text className="text-lg font-bold text-black mb-4  font-okra">
        Today’s Mess Timings
        </Text>

        <View className="gap-4">
          {messTimings.map((timing, index) => {
            const { progress, remainingMinutes } = getCurrentTimeProgress(
              timing.startTime,
              timing.endTime
            );

            const isActive = progress > 0 && progress < 100;
            const isUpcoming = progress === 0 && remainingMinutes > 0;
            const isCompleted = progress === 100;

            // Convert minutes → hours & minutes
            const hrs = Math.floor(remainingMinutes / 60);
            const mins = remainingMinutes % 60;

            return (
              <View
                key={index}
                className="border-b border-gray-200 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0"
              >
                <View className="flex-row items-center">
                  {/* Icon black circle with white icon */}
                  <View className="w-10 h-10 rounded-full bg-black justify-center items-center mr-3">
                    <Feather name={timing.icon as any} size={20} color="white" />
                  </View>

                  {/* Title + Time */}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base font-semibold text-black font-okra">
                        {timing.meal}
                      </Text>
                      <Text className="text-xs font-medium text-gray-600 font-okra">
                        {timing.time}
                      </Text>
                    </View>

                    {/* Progress Bar + Status */}
                    <View className="mt-2">
                      <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View
                          className={`h-full rounded-full ${
                            isActive ? 'bg-black' : 'bg-gray-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </View>
                      <Text className="text-xs mt-1 text-gray-600 font-okra">
                        {isActive
                          ? `${hrs > 0 ? `${hrs}h ` : ''}${mins}m remaining`
                          : isUpcoming
                          ? `Starts in ${hrs > 0 ? `${hrs}h ` : ''}${mins}m`
                          : 'Completed'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
