// components/screens/EditProfile.tsx
import React from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditProfile } from '../../hooks/useEditProfile';
import CustomHeader from '../../components/CustomHeader';
import InputField from '../../components/InputField';
import SubmitButton from '../../components/ui/SubmitButton';
import { useRouter } from 'expo-router';

const EditProfile = () => {
  const router = useRouter();
  const {
    student,
    loading,
    submitting,
    formData,
    setFormData,
    errors,
    hasChanges,
    handleUpdate,
    pickImage,
  } = useEditProfile();

  if (loading) return <Text className="text-center text-lg text-neutral-500 mt-10">Loading...</Text>;
  if (!student) return <Text className="text-center text-lg text-neutral-500 mt-10">No data found.</Text>;

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
                    : formData.profile_pic_url
                      ? { uri: formData.profile_pic_url }
                      : require('../../assets/images/male.png')
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
          error={errors.mobile_no}
        />
        <InputField
          label="Email"
          value={formData.email}
          onChangeText={(v) => setFormData((p) => ({ ...p, email: v }))}
          keyboardType="email-address"
          error={errors.email}
        />
        <InputField
          label="Gender"
          value={formData.gender.toLowerCase()}
          onChangeText={(v) => setFormData((p) => ({ ...p, gender: v }))}
          options={['Male', 'Female', 'Others']}
          error={errors.gender}
        />

        <SubmitButton
          title="Update"
          onPress={handleUpdate}
          loading={submitting}
          disabled={submitting || !hasChanges()}
        />
      </ScrollView>
    </View>
  );
};

export default EditProfile;
