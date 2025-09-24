// components/screens/EditProfile.tsx
import React from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditProfile } from '../../hooks/useEditProfile';
import CustomHeader from '../../components/CustomHeader';
import InputField from '../../components/InputField';
import BirthdayInputField from '../../components/BirthdayInputField';
import { useRouter, useFocusEffect } from 'expo-router';
import { OfflineCheck } from '../../components/withOfflineCheck';

const EditProfileContent = () => {
  const router = useRouter();
  const {
    student,
    loading,
    submitting,
    verifying,
    timer,
    resendCount,
    timerEmail,
    formData,
    setFormData,
    errors,
    hasChanges,
    handleUpdate,
    handleResendVerification,
    pickImage,
    fetchStudentData,
    originalData,
  } = useEditProfile();

  const getDefaultProfileImage = (gender?: string) =>
    gender?.toLowerCase() === 'female'
      ? require('../../assets/images/female.png')
      : require('../../assets/images/male.png');

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchStudentData();
    }, [fetchStudentData])
  );

  if (loading) return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-center text-lg text-neutral-500 mt-10">Loading...</Text>
    </View>
  );
  if (!student) return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-center text-lg text-neutral-500 mt-10">No data found.</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Edit Profile" showBackButton onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-5 bg-white">
        <View className="items-center my-8">
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} className="relative">
            <View className="border-2 border-black rounded-full p-[3px]">
              <Image
                source={
                  formData.newImage
                    ? { uri: formData.newImage.uri }
                    : formData.profile_pic_url?.startsWith('http')
                      ? { uri: formData.profile_pic_url }
                      : getDefaultProfileImage(formData.gender)
                }
                className="w-24 h-24 rounded-full bg-neutral-200"
              />
            </View>
            <View className="absolute -bottom-1 -right-1 bg-black p-1.5 rounded-full border-2 border-white">
              <Feather name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          {errors.image && (
            <Text className="text-center text-sm text-red-500 mt-2">{errors.image}</Text>
          )}

          <View className="flex-row items-center mt-3">
            <Text className="text-lg font-semibold text-black">{student.full_name}</Text>
            <MaterialCommunityIcons
              name="check-decagram"
              size={18}
              color="#000"
              style={{ marginLeft: 6 }}
            />
          </View>
          <Text className="text-sm font-okra text-neutral-500 mt-1">Roll No: {student.roll_no}</Text>
        </View>

        <InputField
          label="Mobile Number"
          value={formData.mobile_no}
          onChangeText={(v) => setFormData((p) => ({ ...p, mobile_no: v }))}
          keyboardType="phone-pad"
          maxLength={10}
          error={errors.mobile_no}
        />
        <InputField
          label="Email"
          value={formData.email ? formData.email.toLowerCase() : ''}
          onChangeText={(v) => setFormData((p) => ({ ...p, email: v.toLowerCase() }))}
          keyboardType="email-address"
          error={errors.email}
          verified={Boolean(student?.email_verified && formData.email === originalData.email)}
          showVerifyButton={Boolean(!student?.email_verified && formData.email === originalData.email)}
          onVerifyPress={handleResendVerification}
          verifying={Boolean(verifying)}
          timer={timerEmail === formData.email ? Number(timer) : 0}
          resendCount={timerEmail === formData.email ? Number(resendCount) : 0}
        />
        <InputField
          label="Gender"
          value={formData.gender.toLowerCase()}
          onChangeText={(v) => setFormData((p) => ({ ...p, gender: v }))}
          options={['Male', 'Female', 'Others']}
          error={errors.gender}
        />
        <BirthdayInputField
          label="Birthday"
          value={formData.birthday}
          onChangeText={(v) => setFormData((p) => ({ ...p, birthday: v }))}
          placeholder="DD-MM-YYYY"
          error={errors.birthday}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleUpdate}
          disabled={submitting}
          className="bg-[#0D0D0D] mt-6 rounded-xl h-12 justify-center items-center"
        >
          {submitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white text-base font-semibold font-okra">Update</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default function EditProfile() {
  return (
    <OfflineCheck 
      message="You're offline"
      title="No Internet Connection"
    >
      <EditProfileContent />
    </OfflineCheck>
  );
}
