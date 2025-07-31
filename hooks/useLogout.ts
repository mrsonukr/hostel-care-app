import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export function useLogout() {
  const router = useRouter();
  const { logout: authLogout } = useAuth();

  const logout = useCallback(async () => {
    try {
      // Use the auth context logout first
      await authLogout();
      
      // Clear any navigation state and use a more robust approach
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to navigate to login screen
      try {
        router.replace('/(auth)/login');
      } catch (navError) {
        console.error('Navigation error:', navError);
        // If that fails, try to go to the root
        try {
          router.replace('/');
        } catch (fallbackError) {
          console.error('Fallback navigation error:', fallbackError);
          // Last resort - force app restart by going to index
          router.replace('/');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Emergency fallback
      try {
        router.replace('/');
      } catch (finalError) {
        console.error('Final navigation error:', finalError);
      }
    }
  }, [router, authLogout]);

  const showLogoutConfirmation = useCallback(() => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  }, [logout]);

  return {
    logout,
    showLogoutConfirmation,
  };
} 