import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';

import { complaintsApi, Complaint } from '../../utils/complaintsApi';
import { getRelativeTime, getFormattedDateTime, getDurationBetweenDates } from '../../utils/dateUtils';

export default function ComplaintDetails() {
  const { id, complaint: complaintParam } = useLocalSearchParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600';
      case 'in_progress':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getIconForCategory = (category: string) => {
    const iconMap: { [key: string]: { icon: string; iconSet: string } } = {
      'Electricity Issues': { icon: 'zap', iconSet: 'Feather' },
      'Plumbing Concerns': { icon: 'droplet', iconSet: 'Feather' },
      'Cleaning Services': { icon: 'broom', iconSet: 'MaterialCommunityIcons' },
      'Room & Facilities Requests': { icon: 'bed-double-outline', iconSet: 'MaterialCommunityIcons' },
    };
    return iconMap[category] || { icon: 'help-circle', iconSet: 'Feather' };
  };

  const getIconForOption = (option: string) => {
    const iconMap: { [key: string]: { icon: string; iconSet: string } } = {
      'Fan (not working/faulty)': { icon: 'ceiling-fan', iconSet: 'MaterialCommunityIcons' },
      'Tubelight problems': { icon: 'lightbulb', iconSet: 'FontAwesome6' },
      'Plug or switch defects': { icon: 'plug', iconSet: 'Octicons' },
      'Short circuit/burning smell': { icon: 'fire', iconSet: 'SimpleLineIcons' },
      'Power outage in room': { icon: 'power', iconSet: 'Feather' },
      'Other electricity-related issues': { icon: 'more-horizontal', iconSet: 'Feather' },
      'Water leakage': { icon: 'water', iconSet: 'Entypo' },
      'Non-functional flush': { icon: 'wheelchair', iconSet: 'FontAwesome5' },
      'Lack of water supply': { icon: 'faucet-drip', iconSet: 'FontAwesome6' },
      'Other plumbing issues': { icon: 'more-horizontal', iconSet: 'Feather' },
      'Room and washroom cleaning': { icon: 'broom', iconSet: 'FontAwesome6' },
      'Other cleaning needs': { icon: 'more-horizontal', iconSet: 'Feather' },
      'Request for a table': { icon: 'table-restaurant', iconSet: 'MaterialIcons' },
      'Request for a chair': { icon: 'chair', iconSet: 'FontAwesome5' },
      'Request for a bed': { icon: 'bed-outline', iconSet: 'Ionicons' },
      'Request for an almirah': { icon: 'door-sliding', iconSet: 'MaterialCommunityIcons' },
      'Internet not working': { icon: 'wifi-off', iconSet: 'Feather' },
      'Other room & facilities issues': { icon: 'more-horizontal', iconSet: 'Feather' },
    };
    return iconMap[option] || { icon: 'more-horizontal', iconSet: 'Feather' };
  };

  const loadComplaintData = async () => {
    try {
      setLoading(true);

      // Check if complaint object is passed directly (from complaint list)
      if (complaintParam) {
        const complaintData = JSON.parse(complaintParam as string);
        setComplaint(complaintData);
        return;
      }

      // Otherwise, fetch by ID (from notifications)
      if (!id) {
        throw new Error('No complaint ID or object provided');
      }

      console.log('Loading complaint with ID:', id);
      const complaintId = parseInt(id as string);
      console.log('Parsed complaint ID:', complaintId);

      if (isNaN(complaintId)) {
        throw new Error('Invalid complaint ID format');
      }

      const complaintData = await complaintsApi.getComplaintById(complaintId);
      console.log('Fetched complaint data:', complaintData);
      setComplaint(complaintData);
    } catch (error) {
      console.error('Error fetching complaint data:', error);
      // Set complaint to null to show error state
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshComplaintData = async () => {
    if (!complaint) return;

    try {
      setRefreshing(true);
      // Fetch fresh data from API using the complaint ID
      const freshComplaint = await complaintsApi.getComplaintById(complaint.id);
      setComplaint(freshComplaint);
    } catch (error) {
      console.error('Error refreshing complaint data:', error);
      // If API fails, keep the existing data
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    await refreshComplaintData();
  };

  useEffect(() => {
    loadComplaintData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <View className="flex-1 bg-white">
          <CustomHeader title="Complaint Details" showBackButton onBackPress={() => router.back()} />
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
            <Text className="text-gray-600 mt-4 font-okra">Loading complaint details...</Text>
          </View>
        </View>
      </>
    );
  }

  if (!complaint) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <View className="flex-1 bg-white">
          <CustomHeader title="Complaint Details" showBackButton onBackPress={() => router.back()} />
          <View className="flex-1 justify-center items-center px-8">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="text-gray-800 font-okra text-lg font-semibold mt-4 text-center">
              Complaint Not Found
            </Text>

          </View>
        </View>
      </>
    );
  }

  const categoryIcon = getIconForCategory(complaint.category);
  const optionIcon = getIconForOption(complaint.subcategory || '');

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <View className="flex-1 bg-white">
        <CustomHeader title="Complaint Details" showBackButton onBackPress={() => router.back()} />

        <ScrollView
          className="flex-1 bg-[#f4f4f4]"
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#000"
              colors={["#000"]}
            />
          }
        >
          {/* Status Progress Card */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-black font-okra mb-4">Complaint Status</Text>

            <View className="flex-row items-center justify-between">
              {/* Submitted Step */}
              <View className="items-center">
                <View className="w-10 h-10 rounded-full bg-green-500 justify-center items-center mb-2">
                  <Feather name="check" size={18} color="white" />
                </View>
                <Text className="text-black font-semibold font-okra text-xs text-center">Submitted</Text>
                <Text className="text-gray-500 font-okra text-xs text-center">{getRelativeTime(complaint.created_at)}</Text>
              </View>

              {/* Connecting Line 1 */}
              <View className={`flex-1 h-0.5 mx-2 ${complaint.status === 'in_progress' || complaint.status === 'resolved' || complaint.status === 'rejected'
                  ? 'bg-green-500' : 'bg-gray-300'
                }`} style={{ marginTop: -30 }} />

              {/* In Progress Step */}
              <View className="items-center">
                <View className={`w-10 h-10 rounded-full justify-center items-center mb-2 ${complaint.status === 'in_progress' || complaint.status === 'resolved' || complaint.status === 'rejected'
                    ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                  {complaint.status === 'in_progress' || complaint.status === 'resolved' || complaint.status === 'rejected' ? (
                    <Feather name="check" size={18} color="white" />
                  ) : (
                    <Feather name="clock" size={18} color="white" />
                  )}
                </View>
                <Text className={`font-semibold font-okra text-xs text-center ${complaint.status === 'in_progress' || complaint.status === 'resolved' || complaint.status === 'rejected'
                    ? 'text-black' : 'text-gray-400'
                  }`}>
                  In Progress
                </Text>
                <Text className="text-gray-500 font-okra text-xs text-center">
                  {complaint.in_progress_at ? getRelativeTime(complaint.in_progress_at) : '--'}
                </Text>
              </View>

              {/* Connecting Line 2 */}
              <View className={`flex-1 h-0.5 mx-2 ${complaint.status === 'resolved' || complaint.status === 'rejected' ? 'bg-green-500' : 'bg-gray-300'
                }`} style={{ marginTop: -30 }} />

              {/* Resolved Step */}
              <View className="items-center">
                <View className={`w-10 h-10 rounded-full justify-center items-center mb-2 ${complaint.status === 'resolved' ? 'bg-green-500' :
                    complaint.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                  }`}>
                  {complaint.status === 'resolved' ? (
                    <Feather name="check" size={18} color="white" />
                  ) : complaint.status === 'rejected' ? (
                    <Feather name="x" size={18} color="white" />
                  ) : (
                    <Feather name="clock" size={18} color="white" />
                  )}
                </View>
                <Text className={`font-semibold font-okra text-xs text-center ${complaint.status === 'resolved' || complaint.status === 'rejected' ? 'text-black' : 'text-gray-400'
                  }`}>
                  {complaint.status === 'rejected' ? 'Rejected' : 'Resolved'}
                </Text>
                <Text className="text-gray-500 font-okra text-xs text-center">
                  {complaint.resolved_at ? getRelativeTime(complaint.resolved_at) :
                    complaint.rejected_at ? getRelativeTime(complaint.rejected_at) : '--'}
                </Text>
              </View>
            </View>

            {/* Resolution Time Display */}
            {complaint.status === 'resolved' && complaint.resolved_at && (
              <View className="mt-4 pt-4 border-t border-gray-100">
                <View className="bg-green-50 rounded-lg p-3">
                  <View className="flex-row items-center justify-center">
                    <MaterialCommunityIcons name="check-decagram" size={20} color="#10B981" />
                    <Text className="text-green-700 font-semibold font-okra ml-2">
                      Resolved in {getDurationBetweenDates(complaint.created_at, complaint.resolved_at)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Complaint Info Card */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3">
                {categoryIcon.iconSet === 'Feather' && (
                  <Feather name={categoryIcon.icon as any} size={20} color="#000" />
                )}
                {categoryIcon.iconSet === 'MaterialCommunityIcons' && (
                  <MaterialCommunityIcons name={categoryIcon.icon as any} size={20} color="#000" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-black font-okra">
                  {complaint.category}
                </Text>
                <Text className="text-base text-gray-600 font-okra">
                  {complaint.subcategory || 'No subcategory'}
                </Text>
              </View>
            </View>

            {/* Complaint ID and Timestamps */}
            <View className="mt-4 pt-4 border-t border-gray-100">
              <View className="space-y-3 gap-2">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Feather name="hash" size={16} color="#666" />
                    <Text className="text-gray-600 font-okra ml-2">Complaint ID:</Text>
                  </View>
                  <Text className="text-black font-semibold font-okra">#{complaint.id}</Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Feather name="calendar" size={16} color="#666" />
                    <Text className="text-gray-600 font-okra ml-2">Submitted:</Text>
                  </View>
                  <Text className="text-black font-okra">{getFormattedDateTime(complaint.created_at)}</Text>
                </View>

                {complaint.in_progress_at && (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Feather name="clock" size={16} color="#666" />
                      <Text className="text-gray-600 font-okra ml-2">In Progress:</Text>
                    </View>
                    <Text className="text-black font-okra">{getFormattedDateTime(complaint.in_progress_at)}</Text>
                  </View>
                )}

                {complaint.resolved_at && (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Feather name="check-circle" size={16} color="#666" />
                      <Text className="text-gray-600 font-okra ml-2">Resolved:</Text>
                    </View>
                    <Text className="text-black font-okra">{getFormattedDateTime(complaint.resolved_at)}</Text>
                  </View>
                )}

                {complaint.rejected_at && (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Feather name="x-circle" size={16} color="#666" />
                      <Text className="text-gray-600 font-okra ml-2">Rejected:</Text>
                    </View>
                    <Text className="text-black font-okra">{getFormattedDateTime(complaint.rejected_at)}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Details Card */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-black font-okra mb-3">Complaint From</Text>

            <View className="space-y-3 gap-2">
              <View className="flex-row items-center">
                <Feather name="user" size={16} color="#666" />
                <Text className="text-gray-600 font-okra ml-2">Student: {complaint.student_name}</Text>
              </View>

              <View className="flex-row items-center">
                <Feather name="hash" size={16} color="#666" />
                <Text className="text-gray-600 font-okra ml-2">Roll No: {complaint.student_roll}</Text>
              </View>

              <View className="flex-row items-center">
                <Feather name="home" size={16} color="#666" />
                <Text className="text-gray-600 font-okra ml-2">Hostel: {complaint.hostel_name}</Text>
              </View>

              <View className="flex-row items-center">
                <Feather name="map-pin" size={16} color="#666" />
                <Text className="text-gray-600 font-okra ml-2">Room: {complaint.room_number}</Text>
              </View>
            </View>
          </View>

          {/* Description Card */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-black font-okra mb-3">Description</Text>
            {complaint.description ? (
              <Text className="text-gray-700 font-okra leading-6">
                {complaint.description}
              </Text>
            ) : (
              <Text className="text-gray-500 font-okra italic">
                No description provided
              </Text>
            )}
          </View>

          {/* Photos Card */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-black font-okra mb-3">Photos</Text>
            {complaint.photos && complaint.photos.length > 0 ? (
              <View className="flex-row flex-wrap gap-3">
                {complaint.photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo }}
                    className="w-24 h-24 rounded-xl"
                    resizeMode="cover"
                  />
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 font-okra italic">
                No photos uploaded
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
