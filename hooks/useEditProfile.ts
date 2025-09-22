// components/logic/useEditProfile.ts
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { resendVerificationEmail } from '../utils/verificationApi';

export interface Student {
  roll_no: string;
  full_name?: string;
  gender?: string;
  mobile_no?: string;
  email?: string;
  birthday?: string;
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
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [resendCount, setResendCount] = useState<number>(0);
  const [timerEmail, setTimerEmail] = useState<string>('');
  const [formData, setFormData] = useState({
    mobile_no: '',
    email: '',
    gender: '',
    birthday: '',
    profile_pic_url: null as string | null,
    newImage: null as ImagePicker.ImagePickerAsset | null,
  });
  const [originalData, setOriginalData] = useState({
    mobile_no: '',
    email: '',
    gender: '',
    birthday: '',
    profile_pic_url: null as string | null,
  });
  const [errors, setErrors] = useState<{ mobile_no?: string; email?: string; gender?: string; birthday?: string; image?: string }>({});

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
        birthday: convertDateFormatFromAPI(parsed.birthday || ''),
        profile_pic_url: parsed.profile_pic_url || null,
        newImage: null,
      });
      setOriginalData({
        mobile_no: parsed.mobile_no || '',
        email: parsed.email || '',
        gender: parsed.gender?.toLowerCase() || '',
        birthday: convertDateFormatFromAPI(parsed.birthday || ''),
        profile_pic_url: parsed.profile_pic_url || null,
      });

      // Load timer and resend count from storage
      const timerData = await AsyncStorage.getItem('verification_timer');
      if (timerData) {
        const { timer: savedTimer, resendCount: savedCount, timestamp, email: savedEmail } = JSON.parse(timerData);
        
        // Only load timer if it's for the same email
        if (savedEmail === parsed.email) {
          const now = Date.now();
          const elapsed = Math.floor((now - timestamp) / 1000);
          const remaining = Math.max(0, savedTimer - elapsed);
          
          if (remaining > 0) {
            setTimer(remaining);
            setResendCount(savedCount);
            setTimerEmail(savedEmail);
            startTimer();
          } else {
            // Timer expired, reset
            setTimer(0);
            setResendCount(0);
            setTimerEmail('');
            await AsyncStorage.removeItem('verification_timer');
          }
        } else {
          // Different email, don't clear timer, just don't show it
          // Timer will be preserved for when user returns to that email
          setTimer(0);
          setResendCount(0);
          setTimerEmail('');
        }
      }
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

  // Check for timer when email changes
  useEffect(() => {
    const checkTimerForEmail = async () => {
      if (formData.email) {
        const timerData = await AsyncStorage.getItem('verification_timer');
        if (timerData) {
          const { timer: savedTimer, resendCount: savedCount, timestamp, email: savedEmail } = JSON.parse(timerData);
          
          // If timer is for current email, load it
          if (savedEmail === formData.email) {
            const now = Date.now();
            const elapsed = Math.floor((now - timestamp) / 1000);
            const remaining = Math.max(0, savedTimer - elapsed);
            
            if (remaining > 0) {
              setTimer(remaining);
              setResendCount(savedCount);
              setTimerEmail(savedEmail);
              startTimer();
            } else {
              // Timer expired, reset
              setTimer(0);
              setResendCount(0);
              setTimerEmail('');
              await AsyncStorage.removeItem('verification_timer');
            }
          } else {
            // Different email, don't show timer
            setTimer(0);
            setResendCount(0);
            setTimerEmail('');
          }
        }
      }
    };
    
    checkTimerForEmail();
  }, [formData.email]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      // Cleanup any running timers
    };
  }, []);

  const hasChanges = () =>
    formData.mobile_no !== originalData.mobile_no ||
    formData.email !== originalData.email ||
    formData.gender.toLowerCase() !== originalData.gender ||
    formData.birthday !== originalData.birthday ||
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

  const convertDateFormat = (dateStr: string) => {
    if (!dateStr || !dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) return dateStr;
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const convertDateFormatFromAPI = (dateStr: string) => {
    if (!dateStr || !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
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
    
    // Phone number validation
    if (!formData.mobile_no.match(/^\d{10}$/)) {
      errs.mobile_no = 'Must be 10 digits.';
    } else if (!formData.mobile_no.match(/^[6-9]/)) {
      errs.mobile_no = 'Correct your phone number';
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Correct your email';
    if (!['male', 'female', 'others'].includes(formData.gender.toLowerCase())) errs.gender = 'Invalid gender.';
    
    // Birthday validation
    if (formData.birthday && !formData.birthday.match(/^\d{2}-\d{2}-\d{4}$/)) {
      errs.birthday = 'Invalid date format. Use DD-MM-YYYY';
    } else if (formData.birthday) {
      // Validate the actual date
      const [day, month, year] = formData.birthday.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        errs.birthday = 'Invalid date';
      } else {
        // Check if date is not in the future
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (date > today) {
          errs.birthday = 'Birthday cannot be in the future';
        }
      }
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getTimerDuration = (count: number) => {
    if (count === 0) return 60; // 1 minute for first verify
    if (count === 1) return 120; // 2 minutes for 1st resend
    if (count === 2) return 180; // 3 minutes for 2nd resend
    if (count === 3) return 300; // 5 minutes for 3rd resend
    if (count === 4) return 600; // 10 minutes for 4th resend
    return 60; // Reset to 1 minute after 5th resend
  };

  const handleResendVerification = async () => {
    if (!student?.roll_no) return;
    
    setVerifying(true);
    try {
      const result = await resendVerificationEmail(student.roll_no);
      
      if (result.success) {
        Alert.alert('Success', result.message);
        // Increment resend count and start timer
        const newCount = resendCount + 1;
        setResendCount(newCount);
        const duration = getTimerDuration(newCount);
        setTimer(duration);
        
        // Save timer data to storage with email
        await AsyncStorage.setItem('verification_timer', JSON.stringify({
          timer: duration,
          resendCount: newCount,
          timestamp: Date.now(),
          email: formData.email
        }));
        
        setTimerEmail(formData.email);
        
        startTimer();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send verification email');
    } finally {
      setVerifying(false);
    }
  };

  const startTimer = () => {
    const interval = setInterval(async () => {
      setTimer((prev) => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(interval);
          // Reset resend count when timer expires (after 5 attempts)
          if (resendCount >= 4) {
            setResendCount(0);
            setTimerEmail('');
            AsyncStorage.removeItem('verification_timer');
          }
          return 0;
        }
        return newValue;
      });
    }, 1000);
  };

  const handleUpdate = async () => {
    if (!hasChanges()) {
      router.back(); // Always go back even if no changes
      return;
    }
    if (!validateForm()) return; // Just return without alert since errors are shown below inputs

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

        const res = await fetch('https://hostel.mssonutech.workers.dev/', {
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
        gender: formData.gender.toLowerCase(),
        birthday: convertDateFormat(formData.birthday),
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
        gender: payload.gender.toLowerCase(),
        birthday: convertDateFormatFromAPI(payload.birthday),
        profile_pic_url: payload.profile_pic_url,
      });
      setFormData((f) => ({ ...f, newImage: null }));
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
  };
}
