import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons, Octicons, SimpleLineIcons, FontAwesome6, Entypo, FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../../components/CustomHeader';
import ComplaintCategoryItem from '../../../components/ComplaintCategoryItem';
import ComplaintOptionItem from '../../../components/ComplaintOptionItem';
import PhotoUploadSection from '../../../components/PhotoUploadSection';
import DescriptionInput from '../../../components/DescriptionInput';
import * as ImagePicker from 'expo-image-picker';

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

  // Mock data for complaint status
  const complaintStatus = [
    {
      id: '1',
      category: 'Electricity Issues',
      issue: 'Fan (not working/faulty)',
      status: 'In Progress',
      date: '2024-01-15',
      description: 'Fan in room 101 is not working properly'
    },
    {
      id: '2',
      category: 'Plumbing Concerns',
      issue: 'Water leakage',
      status: 'Completed',
      date: '2024-01-10',
      description: 'Water leakage from bathroom tap'
    },
    {
      id: '3',
      category: 'Cleaning Services',
      issue: 'Room and washroom cleaning',
      status: 'Pending',
      date: '2024-01-20',
      description: 'Request for room cleaning'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600';
      case 'In Progress':
        return 'text-blue-600';
      case 'Pending':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return { icon: 'check-circle', iconSet: 'Feather' };
      case 'In Progress':
        return { icon: 'clock', iconSet: 'Feather' };
      case 'Pending':
        return { icon: 'loader', iconSet: 'Feather' };
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

  const handleSubmit = () => {
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

    Alert.alert(
      'Complaint Submitted',
      `Category: ${selectedCategory}\nIssue: ${selectedOption}\nDescription: ${description.trim() || 'N/A'}\nPhotos: ${images.length}`
    );

    setSelectedCategory(null);
    setSelectedOption(null);
    setDescription('');
    setImages([]);
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
              className="mt-6 bg-black rounded-xl py-4 items-center"
            >
              <Text className="text-white text-base font-semibold font-okra">Submit</Text>
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
        
        {complaintStatus.map((complaint, index) => {
          const statusIcon = getStatusIcon(complaint.status);
          const IconComponent = statusIcon.iconSet === 'Feather' ? Feather : 
                              statusIcon.iconSet === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
                              statusIcon.iconSet === 'Octicons' ? Octicons :
                              statusIcon.iconSet === 'SimpleLineIcons' ? SimpleLineIcons :
                              statusIcon.iconSet === 'FontAwesome6' ? FontAwesome6 :
                              statusIcon.iconSet === 'Entypo' ? Entypo :
                              statusIcon.iconSet === 'FontAwesome5' ? FontAwesome5 :
                              statusIcon.iconSet === 'MaterialIcons' ? MaterialIcons :
                              statusIcon.iconSet === 'Ionicons' ? Ionicons : Feather;

          return (
            <View key={complaint.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-black font-okra">
                    {complaint.category}
                  </Text>
                  <Text className="text-base text-gray-600 font-okra mt-1">
                    {complaint.issue}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <IconComponent 
                    name={statusIcon.icon as any} 
                    size={20} 
                    color={complaint.status === 'Completed' ? '#16a34a' : 
                           complaint.status === 'In Progress' ? '#2563eb' : 
                           complaint.status === 'Pending' ? '#ea580c' : '#6b7280'} 
                  />
                  <Text className={`ml-2 font-semibold font-okra ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </Text>
                </View>
              </View>
              
              <Text className="text-sm text-gray-500 font-okra mb-2">
                Submitted on: {complaint.date}
              </Text>
              
              <Text className="text-sm text-gray-700 font-okra">
                {complaint.description}
              </Text>
            </View>
          );
        })}
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
