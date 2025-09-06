import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { deactivateDevice } from '../utils/notificationApi';

interface AuthContextType {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
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
      // Get student data before clearing it to deactivate device
      const studentData = await AsyncStorage.getItem('student');
      
      // Deactivate device for push notifications
      if (studentData) {
        try {
          const student = JSON.parse(studentData);
          if (student && student.roll_no) {
            const deviceResult = await deactivateDevice(student.roll_no);
            if (deviceResult.success) {
              console.log('Device deactivated successfully');
            } else {
              console.warn('Failed to deactivate device:', deviceResult.error);
            }
          } else {
            console.warn('Student data missing roll_no, skipping device deactivation');
          }
        } catch (notificationError) {
          console.error('Error deactivating device:', notificationError);
          // Don't block logout if device deactivation fails
        }
      }
      
      await AsyncStorage.removeItem('student');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      setIsAuthenticated(false);
    }
  };



  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout, checkAuthStatus }}>
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