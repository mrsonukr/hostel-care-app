// components/logic/useEditProfile.ts
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

export interface Student {
  roll_no: string;
  full_name?: string;
  gender?: string;
  mobile_no?: string;
  email?: string;
  hostel_no?: string | null;
  room_no?: string | null;
  email_verified: boolean;
  created_at?: string;
  profile_pic_url?: string | null;
}

export function useEditProfile() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    mobile_no: '',
    email: '',
    gender: '',
    profile_pic_url: null as string | null,
    newImage: null as ImagePicker.ImagePickerAsset | null,
  });
  const [originalData, setOriginalData] = useState({
    mobile_no: '',
    email: '',
    gender: '',
    profile_pic_url: null as string | null,
  });
  const [errors, setErrors] = useState<{ mobile_no?: string; email?: string; gender?: string; image?: string }>({});

  const fetchStudentData = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('student');
      if (!data) throw new Error('No user');
      const parsed: Student = JSON.parse(data);
      setStudent(parsed);
      setFormData({
        mobile_no: parsed.mobile_no || '',
        email: parsed.email || '',
        gender: parsed.gender || '',
        profile_pic_url: parsed.profile_pic_url || null,
        newImage: null,
      });
      setOriginalData({
        mobile_no: parsed.mobile_no || '',
        email: parsed.email || '',
        gender: parsed.gender || '',
        profile_pic_url: parsed.profile_pic_url || null,
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to load user data.');
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const hasChanges = () =>
    formData.mobile_no !== originalData.mobile_no ||
    formData.email !== originalData.email ||
    formData.gender !== originalData.gender ||
    formData.newImage !== null;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'Enable access to photos in settings.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const selected = result.assets[0];
      if (!['image/jpeg', 'image/png'].includes(selected.mimeType || '')) {
        setErrors((e) => ({ ...e, image: 'Only JPEG or PNG allowed.' }));
        return;
      }

      try {
        const compressed = await compressImageToWebP(selected);
        setFormData((f) => ({ ...f, newImage: compressed }));
        setErrors((e) => ({ ...e, image: undefined }));
      } catch {
        setErrors((e) => ({ ...e, image: 'Image processing failed.' }));
      }
    }
  };

  const compressImageToWebP = async (image: ImagePicker.ImagePickerAsset) => {
    let quality = 0.6;
    let uri = image.uri;

    while (quality > 0.05) {
      const result = await manipulateAsync(uri, [{ resize: { width: 400 } }], {
        compress: quality,
        format: SaveFormat.WEBP,
      });

      const blob = await (await fetch(result.uri)).blob();
      if (blob.size / 1024 <= 50) {
        return { ...image, uri: result.uri, mimeType: 'image/webp' };
      }

      quality -= 0.05;
      uri = result.uri;
    }

    return { ...image, uri };
  };

  const validateForm = () => {
    const errs: typeof errors = {};
    if (!formData.mobile_no.match(/^\d{10}$/)) errs.mobile_no = 'Must be 10 digits.';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Invalid email.';
    if (!['Male', 'Female', 'Others'].includes(formData.gender)) errs.gender = 'Invalid gender.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async () => {
    if (!hasChanges()) return Alert.alert('No Changes', 'Nothing to update.');
    if (!validateForm()) return Alert.alert('Error', 'Fix errors before updating.');

    setSubmitting(true);
    try {
      let profilePicUrl = formData.profile_pic_url;
      if (formData.newImage) {
        const formDataToSend = new FormData();
        formDataToSend.append('image', {
          uri: formData.newImage.uri,
          type: 'image/webp',
          name: 'profile.webp',
        } as any);

        const res = await fetch('https://hostel.mssonukr.workers.dev/', {
          method: 'POST',
          body: formDataToSend,
        });
        const json = await res.json();

        if (res.ok && json.urls?.[0]) profilePicUrl = json.urls[0];
        else throw new Error(json.error || 'Image upload failed.');
      }

      const payload = {
        ...student!,
        mobile_no: formData.mobile_no,
        email: formData.email,
        gender: formData.gender,
        profile_pic_url: profilePicUrl,
      };

      const updateRes = await fetch(
        `https://hostelapis.mssonutech.workers.dev/api/student/${student?.roll_no}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await updateRes.json();
      if (!updateRes.ok || !result.success) throw new Error(result.error);

      await AsyncStorage.setItem('student', JSON.stringify(payload));
      setStudent(payload);
      setOriginalData({
        mobile_no: payload.mobile_no,
        email: payload.email,
        gender: payload.gender,
        profile_pic_url: payload.profile_pic_url,
      });
      setFormData((f) => ({ ...f, newImage: null }));
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    student,
    loading,
    submitting,
    formData,
    setFormData,
    errors,
    hasChanges,
    handleUpdate,
    pickImage,
  };
}
