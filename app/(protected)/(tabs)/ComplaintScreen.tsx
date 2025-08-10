import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather, MaterialCommunityIcons, Octicons, SimpleLineIcons, FontAwesome6, Entypo, FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../../components/CustomHeader';
import ComplaintCategoryItem from '../../../components/ComplaintCategoryItem';
import ComplaintOptionItem from '../../../components/ComplaintOptionItem';
import PhotoUploadSection from '../../../components/PhotoUploadSection';
import DescriptionInput from '../../../components/DescriptionInput';
import * as ImagePicker from 'expo-image-picker';
import { complaintsApi, Complaint } from '../../../utils/complaintsApi';

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

export default function ComplaintTab() {
  const [activeTab, setActiveTab] = useState<'new' | 'status'>('new');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [complaintStatus, setComplaintStatus] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);

  // Load student data and fetch complaints
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const studentJson = await AsyncStorage.getItem('student');
        console.log('Raw student JSON:', studentJson); // Debug log
        if (studentJson) {
          const student = JSON.parse(studentJson);
          console.log('Parsed student data:', student); // Debug log
          console.log('Student data keys:', Object.keys(student)); // Debug log
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
      } catch (error) {
        console.error('Error loading student data:', error);
        Alert.alert('Error', 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

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
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(prev => (prev === option ? null : option));
    setDescription('');
    setImages([]);
  };

  const pickImage = async () => {
    if (images.length >= 4) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImages(prev => [...prev, result.assets[0].uri].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
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
      console.log('Student data in submit:', studentData); // Debug log
      console.log('Student data keys in submit:', Object.keys(studentData || {})); // Debug log
      
      // Use the same property names as settings screen
      const studentRoll = studentData.roll_no;
      const studentName = studentData.full_name || 'Unknown';
      const roomNumber = studentData.room_no || 'N/A';
      const hostelName = studentData.hostel_no || 'N/A';

      console.log('Extracted values:', { studentRoll, studentName, roomNumber, hostelName }); // Debug log

      if (!studentRoll) {
        console.log('Available student data properties:', Object.keys(studentData || {})); // Debug log
        Alert.alert('Error', 'Student roll number not found. Please login again.');
        return;
      }

      const complaintData = {
        student_roll: studentRoll,
        student_name: studentName,
        category: selectedCategory!,
        subcategory: selectedOption!,
        description: description.trim() || undefined,
        photos: images.length > 0 ? images : undefined,
        room_number: roomNumber,
        hostel_name: hostelName,
        status: 'pending'
      };

      console.log('Complaint data being sent:', complaintData); // Debug log

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
              
              // Refresh complaints list
              loadComplaints();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert('Error', 'Failed to submit complaint. Please try again.');
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
    } catch (error) {
      console.error('Error loading complaints:', error);
      Alert.alert('Error', 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSubmit}
              disabled={submitting}
              className={`mt-6 rounded-xl py-4 items-center ${submitting ? 'bg-gray-400' : 'bg-black'}`}
            >
              {submitting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white text-base font-semibold font-okra ml-2">Submitting...</Text>
                </View>
              ) : (
                <Text className="text-white text-base font-semibold font-okra">Submit</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const renderNewComplaint = () => {
    return (
      <ScrollView className="flex-1 bg-[#f3f2f7]" contentContainerStyle={{ padding: 20 }}>
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
      <ScrollView className="flex-1 bg-[#f3f2f7]" contentContainerStyle={{ padding: 20 }}>
        <Text className="text-xl font-bold text-black mb-4 font-okra">
          Complaint Status
        </Text>
        
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
            
            return (
              <View key={complaint.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-black font-okra">
                      {complaint.category}
                    </Text>
                    <Text className="text-base text-gray-600 font-okra mt-1">
                      {complaint.subcategory || 'No subcategory'}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather 
                      name={statusIcon.icon as any} 
                      size={20} 
                      color={complaint.status === 'resolved' ? '#16a34a' : 
                             complaint.status === 'in_progress' ? '#2563eb' : 
                             complaint.status === 'pending' ? '#ea580c' : 
                             complaint.status === 'rejected' ? '#dc2626' : '#6b7280'} 
                    />
                    <Text className={`ml-2 font-semibold font-okra ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <Text className="text-sm text-gray-500 font-okra mb-2">
                  Submitted on: {new Date(complaint.created_at).toLocaleDateString()}
                </Text>
                
                <Text className="text-sm text-gray-700 font-okra">
                  {complaint.description || 'No description provided'}
                </Text>
              </View>
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
            onPress={() => setActiveTab('new')}
            className={`flex-1 py-4 items-center ${activeTab === 'new' ? 'border-b-2 border-black' : ''}`}
          >
            <Text className={`font-semibold font-okra ${activeTab === 'new' ? 'text-black' : 'text-gray-500'}`}>
              New Complaint
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('status')}
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
