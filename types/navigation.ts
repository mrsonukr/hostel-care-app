import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  RegisterScreen1: undefined;
  RegisterScreen2: {
    roll: string;
    phone: string;
    email: string;
  };
  ForgotPasswordScreen1: undefined;
  ForgotPasswordScreen2: {
    rollNumber: string;
    email: string;
  };
  ForgotPasswordScreen3: {
    rollNumber: string;
    email: string;
  };
  Home: {
    studentData?: StudentData;
  };
  Settings: {
    studentData?: StudentData;
  };
  Notifications: undefined;
};

export type StudentData = {
  id: string;
  full_name: string;
  roll_no: string;
  mobile_no: string;
  email: string;
  email_verified: number;
  gender: 'male' | 'female';
  profile_pic_url?: string;
  room_no?: string;
  hostel_no?: string;
  created_at: string;
  updated_at: string;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  student?: StudentData;
  error?: string;
  message?: string;
};

export type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreen1Props = NativeStackScreenProps<RootStackParamList, 'RegisterScreen1'>;
export type RegisterScreen2Props = NativeStackScreenProps<RootStackParamList, 'RegisterScreen2'>;
export type ForgotPasswordScreen1Props = NativeStackScreenProps<RootStackParamList, 'ForgotPasswordScreen1'>;
export type ForgotPasswordScreen2Props = NativeStackScreenProps<RootStackParamList, 'ForgotPasswordScreen2'>;
export type ForgotPasswordScreen3Props = NativeStackScreenProps<RootStackParamList, 'ForgotPasswordScreen3'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;