import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { notificationService } from '../utils/notificationService';

interface AuthContextType {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  registerDeviceForNotifications: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuthStatus = async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      setIsAuthenticated(!!studentData);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      // Get student data before removing it
      const studentData = await AsyncStorage.getItem('student');
      let userId: string | null = null;
      
      if (studentData) {
        const student = JSON.parse(studentData);
        userId = student.roll_no;
      }

      // Deactivate device for notifications
      if (userId) {
        try {
          await notificationService.deactivateDevice(userId);
        } catch (error) {
          console.error('Error deactivating device:', error);
        }
      }

      await AsyncStorage.removeItem('student');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      setIsAuthenticated(false);
    }
  };

  const registerDeviceForNotifications = async (userId: string) => {
    try {
      console.log('📱 Registering device for notifications for user:', userId);
      
      // Register device with notification API (service should already be initialized)
      const success = await notificationService.registerDevice(userId);
      
      if (success) {
        console.log('✅ Device registered successfully for notifications');
      } else {
        console.log('❌ Failed to register device for notifications');
      }
    } catch (error) {
      console.error('Error registering device for notifications:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout, checkAuthStatus, registerDeviceForNotifications }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 