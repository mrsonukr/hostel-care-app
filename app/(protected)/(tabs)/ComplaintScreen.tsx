import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Feather, MaterialCommunityIcons, Octicons, SimpleLineIcons, FontAwesome6, Entypo, FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../../components/CustomHeader';
import ComplaintCategoryItem from '../../../components/ComplaintCategoryItem';
import ComplaintOptionItem from '../../../components/ComplaintOptionItem';
import PhotoUploadSection from '../../../components/PhotoUploadSection';
import DescriptionInput from '../../../components/DescriptionInput';
import { complaintsApi, Complaint } from '../../../utils/complaintsApi';
import { pickComplaintImage, uploadComplaintImages } from '../../../utils/imageUpload';
import { getRelativeTime } from '../../../utils/dateUtils';
import { useRouter, useFocusEffect } from 'expo-router';
import { errorHandler, AppError, errorMessages } from '../../../utils/errorHandler';
import { OfflineCheck } from '../../../components/withOfflineCheck';


const complaintCategories = [
  {
    iconSet: 'Feather',
    icon: 'zap',
    label: 'Electricity Issues',
  },
  {
    iconSet: 'Feather',
    icon: 'droplet',
    label: 'Plumbing Concerns',
  },
  {
    iconSet: 'MaterialCommunityIcons',
    icon: 'broom',
    label: 'Cleaning Services',
  },
  {
    iconSet: 'MaterialCommunityIcons',
    icon: 'bed-double-outline',
    label: 'Room & Facilities Requests',
  },
];

const complaintOptions = {
  "Electricity Issues": [
    "Fan (not working/faulty)",
    "Tubelight problems",
    "Plug or switch defects",
    "Short circuit/burning smell",
    "Power outage in room",
    "Other electricity-related issues"
  ],
  "Plumbing Concerns": [
    "Water leakage",
    "Non-functional flush",
    "Lack of water supply",
    "Other plumbing issues"
  ],
  "Cleaning Services": [
    "Room and washroom cleaning",
    "Other cleaning needs"
  ],
  "Room & Facilities Requests": [
    "Request for a table",
    "Request for a chair",
    "Request for a bed",
    "Request for an almirah",
    "Internet not working",
    "Other room & facilities issues"
  ]
};

function ComplaintTabContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'new' | 'status'>('new');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [complaintStatus, setComplaintStatus] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [lastActiveTab, setLastActiveTab] = useState<'new' | 'status'>('new');

  // Load student data and fetch complaints
  const loadStudentData = useCallback(async () => {
    try {
      const studentJson = await AsyncStorage.getItem('student');
      if (studentJson) {
        const student = JSON.parse(studentJson);
        setStudentData(student);
        
        // Fetch complaints for the student
        setLoading(true);
        const studentRoll = student.roll_no;
        if (studentRoll) {
          const complaints = await complaintsApi.getComplaintsByStudent(studentRoll);
          setComplaintStatus(complaints);
        } else {
          console.error('Student roll number not found in student data');
        }
      }
    } catch (error: any) {
      console.error('Error loading student data:', error);
      if (error instanceof AppError) {
        errorHandler.showErrorAlert(error, loadStudentData);
      } else {
        const appError = errorHandler.handleFetchError(error, 'loading student data');
        errorHandler.showErrorAlert(appError, loadStudentData);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load student data when component mounts
  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  // Refresh student data whenever screen comes into focus (e.g., after hostel/room change)
  useFocusEffect(
    useCallback(() => {
      loadStudentData();
    }, [loadStudentData])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-orange-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return { icon: 'check-circle', iconSet: 'Feather' };
      case 'in_progress':
        return { icon: 'clock', iconSet: 'Feather' };
      case 'pending':
        return { icon: 'loader', iconSet: 'Feather' };
      case 'rejected':
        return { icon: 'x-circle', iconSet: 'Feather' };
      default:
        return { icon: 'help-circle', iconSet: 'Feather' };
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedOption(null);
    setDescription('');
    setImages([]);
    setSelectedImages([]);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(prev => (prev === option ? null : option));
    setDescription('');
    setImages([]);
    setSelectedImages([]);
  };

  const pickImage = async () => {
    if (selectedImages.length >= 4) return;

    try {
      const selectedImage = await pickComplaintImage();
      if (selectedImage) {
        setSelectedImages(prev => [...prev, selectedImage].slice(0, 4));
        setImages(prev => [...prev, selectedImage.uri].slice(0, 4));
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        errorHandler.showErrorAlert(error);
      } else {
        const appError = errorHandler.handleFetchError(error, 'selecting image');
        errorHandler.showErrorAlert(appError);
      }
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    const updatedSelectedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    updatedSelectedImages.splice(index, 1);
    setImages(updatedImages);
    setSelectedImages(updatedSelectedImages);
  };

  const handleSubmit = async () => {
    if (!studentData) {
      Alert.alert('Error', 'Student data not found. Please login again.');
      return;
    }

    const requiresDescription = [
      'Other electricity-related issues',
      'Other plumbing issues',
      'Other cleaning needs',
      'Other room & facilities issues'
    ];
    
    if (requiresDescription.includes(selectedOption || '') && description.trim() === '') {
      Alert.alert('Description Required', 'Please provide a description for the selected issue.');
      return;
    }

    setSubmitting(true);

    try {
      
      
      // Use the same property names as settings screen
      const studentRoll = studentData.roll_no;
      const studentName = studentData.full_name || 'Unknown';
      const roomNumber = studentData.room_no || 'N/A';
      const hostelName = studentData.hostel_no || 'N/A';

      // Log the hostel and room data being used for debugging
      console.log('Complaint submission - Current hostel/room data:', {
        hostel: hostelName,
        room: roomNumber,
        studentRoll,
        studentName
      });


      if (!studentRoll) {
        Alert.alert('Error', 'Student roll number not found. Please login again.');
        return;
      }

      // Upload images if any
      let uploadedImageUrls: string[] = [];
      if (selectedImages.length > 0) {
        try {
          uploadedImageUrls = await uploadComplaintImages(selectedImages);
        } catch (error: any) {
          if (error instanceof AppError) {
            errorHandler.showErrorAlert(error, () => handleSubmit());
          } else {
            const appError = errorHandler.handleFetchError(error, 'uploading images');
            errorHandler.showErrorAlert(appError, () => handleSubmit());
          }
          return;
        }
      }

      const complaintData = {
        student_roll: studentRoll,
        student_name: studentName,
        category: selectedCategory!,
        subcategory: selectedOption!,
        description: description.trim() || undefined,
        photos: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
        room_number: roomNumber,
        hostel_name: hostelName,
        status: 'pending'
      };



      const response = await complaintsApi.createComplaint(complaintData);

      Alert.alert(
        'Success',
        'Complaint submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedCategory(null);
              setSelectedOption(null);
              setDescription('');
              setImages([]);
              setSelectedImages([]);
              
              // Switch to status tab
              setActiveTab('status');
              
              // Refresh student data and complaints list to ensure latest hostel/room info
              loadStudentData();
              loadComplaints();
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error submitting complaint:', error);
      if (error instanceof AppError) {
        errorHandler.showErrorAlert(error, () => handleSubmit());
      } else {
        const appError = errorHandler.handleFetchError(error, 'submitting complaint');
        errorHandler.showErrorAlert(appError, () => handleSubmit());
      }
    } finally {
      setSubmitting(false);
    }
  };

  const loadComplaints = async () => {
    if (!studentData) return;
    
    try {
      setLoading(true);
      const studentRoll = studentData.roll_no;
      if (!studentRoll) {
        console.error('Student roll number not found');
        return;
      }
      const complaints = await complaintsApi.getComplaintsByStudent(studentRoll);
      setComplaintStatus(complaints);
    } catch (error: any) {
      console.error('Error loading complaints:', error);
      if (error instanceof AppError) {
        errorHandler.showErrorAlert(error, loadComplaints);
      } else {
        const appError = errorHandler.handleFetchError(error, 'loading complaints');
        errorHandler.showErrorAlert(appError, loadComplaints);
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh both student data and complaints to ensure latest hostel/room info
    await loadStudentData();
    await loadComplaints();
    setRefreshing(false);
  };

  const handleBack = () => {
    if (selectedOption) {
      setSelectedOption(null);
      setDescription('');
      setImages([]);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const handleTabSwitch = (tab: 'new' | 'status') => {
    if (activeTab === tab) {
      // If clicking the same tab, go back to main complaint page
      setActiveTab('new');
      setSelectedCategory(null);
      setSelectedOption(null);
      setDescription('');
      setImages([]);
      setSelectedImages([]);
    } else {
      // If switching to different tab, remember the last state
      setLastActiveTab(activeTab);
      setActiveTab(tab);
    }
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

  const getIconForCategory = (category: string) => {
    const iconMap: { [key: string]: { icon: string; iconSet: string } } = {
      'Electricity Issues': { icon: 'zap', iconSet: 'Feather' },
      'Plumbing Concerns': { icon: 'droplet', iconSet: 'Feather' },
      'Cleaning Services': { icon: 'broom', iconSet: 'MaterialCommunityIcons' },
      'Room & Facilities Requests': { icon: 'bed-double-outline', iconSet: 'MaterialCommunityIcons' },
    };
    return iconMap[category] || { icon: 'help-circle', iconSet: 'Feather' };
  };

  const renderOptions = () => {
    if (!selectedCategory) return null;

    const options = complaintOptions[selectedCategory as keyof typeof complaintOptions] || [];
    const optionsToShow = selectedOption
      ? options.filter((option) => option === selectedOption)
      : options;

    return (
      <View className="flex-1">
        <Text className="text-base font-semibold text-black mb-4 font-okra">
          {selectedOption ? 'Selected Problem:' : 'Select a problem:'}
        </Text>

        {optionsToShow.map((option, index) => (
          <ComplaintOptionItem
            key={index}
            option={option}
            isSelected={selectedOption === option}
            onPress={() => handleOptionSelect(option)}
            getIconForOption={getIconForOption}
          />
        ))}

        {selectedOption && (
          <>
            <DescriptionInput
              description={description}
              onDescriptionChange={setDescription}
              selectedOption={selectedOption}
            />

            <PhotoUploadSection
              images={images}
              onPickImage={pickImage}
              onRemoveImage={removeImage}
            />

            {/* Submit */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={submitting}
              style={{ borderRadius: 12, marginTop: 24, backgroundColor: '#0D0D0D' }}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            >
              {submitting ? <ActivityIndicator color="white" size="small" /> : 'Submit'}
            </Button>
          </>
        )}
      </View>
    );
  };

  const renderNewComplaint = () => {
    return (
      <ScrollView className="flex-1 bg-[#f4f4f4]" contentContainerStyle={{ padding: 20 }}>
        {!selectedCategory ? (
          <View>
            {complaintCategories.map(({ iconSet, icon, label }, idx) => (
              <ComplaintCategoryItem
                key={idx}
                iconSet={iconSet}
                icon={icon}
                label={label}
                onPress={() => handleCategorySelect(label)}
              />
            ))}
          </View>
        ) : (
          renderOptions()
        )}
      </ScrollView>
    );
  };

    const renderStatus = () => {
    return (
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

        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#000" />
            <Text className="text-gray-600 mt-4 font-okra">Loading complaints...</Text>
          </View>
        ) : complaintStatus.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-600 text-center font-okra">No complaints found</Text>
          </View>
        ) : (
          complaintStatus.map((complaint, index) => {
            const statusIcon = getStatusIcon(complaint.status);
            const categoryIcon = getIconForCategory(complaint.category);
            
            return (
              <TouchableOpacity 
                key={complaint.id} 
                className="bg-white rounded-xl p-4 mb-4"
                activeOpacity={0.7}
                onPress={() => router.push({
                  pathname: '/(protected)/complaint-details',
                  params: { complaint: JSON.stringify(complaint) }
                })}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1 flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3">
                      {categoryIcon.iconSet === 'Feather' && (
                        <Feather name={categoryIcon.icon as any} size={20} color="#000" />
                      )}
                      {categoryIcon.iconSet === 'MaterialCommunityIcons' && (
                        <MaterialCommunityIcons name={categoryIcon.icon as any} size={20} color="#000" />
                      )}
                      {categoryIcon.iconSet === 'FontAwesome6' && (
                        <FontAwesome6 name={categoryIcon.icon as any} size={20} color="#000" />
                      )}
                      {categoryIcon.iconSet === 'Octicons' && (
                        <Octicons name={categoryIcon.icon as any} size={20} color="#000" />
                      )}
                      {categoryIcon.iconSet === 'SimpleLineIcons' && (
                        <SimpleLineIcons name={categoryIcon.icon as any} size={20} color="#000" />
                      )}
                      {categoryIcon.iconSet === 'Entypo' && (
                        <Entypo name={categoryIcon.icon as any} size={20} color="#000" />
                      )}
                      {categoryIcon.iconSet === 'FontAwesome5' && (
                        <FontAwesome5 name={categoryIcon.icon as any} size={20} color="#000" />
                      )}
                      {categoryIcon.iconSet === 'MaterialIcons' && (
                        <MaterialIcons name={categoryIcon.icon as any} size={20} color="#000" />
                      )}
                      {categoryIcon.iconSet === 'Ionicons' && (
                        <Ionicons name={categoryIcon.icon as any} size={20} color="#000" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-black font-okra">
                        {complaint.category}
                      </Text>
                      <Text className="text-base text-gray-600 font-okra mt-1">
                        {complaint.subcategory || 'No subcategory'}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className={`font-semibold font-okra ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('_', ' ').toUpperCase()}
                    </Text>
                    <Text className="text-sm text-gray-500 font-okra mt-1">
                      {getRelativeTime(complaint.created_at)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    );
  };

  return (
    <>
      <CustomHeader 
        title={selectedCategory ? selectedCategory : "Complaint"} 
        showBackButton={selectedCategory !== null}
        onBackPress={handleBack}
      />
      
      {/* Tab Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleTabSwitch('new')}
            className={`flex-1 py-4 items-center ${activeTab === 'new' ? 'border-b-2 border-black' : ''}`}
          >
            <Text className={`font-semibold font-okra ${activeTab === 'new' ? 'text-black' : 'text-gray-500'}`}>
              New Complaint
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleTabSwitch('status')}
            className={`flex-1 py-4 items-center ${activeTab === 'status' ? 'border-b-2 border-black' : ''}`}
          >
            <Text className={`font-semibold font-okra ${activeTab === 'status' ? 'text-black' : 'text-gray-500'}`}>
              Status
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      {activeTab === 'new' ? renderNewComplaint() : renderStatus()}
    </>
  );
}

export default function ComplaintTab() {
  return (
    <OfflineCheck 
      message="You're offline"
      title="No Internet Connection"
    >
      <ComplaintTabContent />
    </OfflineCheck>
  );
}
