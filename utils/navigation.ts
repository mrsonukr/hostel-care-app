import { useRouter } from 'expo-router';

export function useSafeNavigation() {
  const router = useRouter();

  const safeReplace = (route: string, delay: number = 100) => {
    try {
      setTimeout(() => {
        router.replace(route);
      }, delay);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to index route
      setTimeout(() => {
        router.replace('/');
      }, delay);
    }
  };

  const safePush = (route: string, delay: number = 100) => {
    try {
      setTimeout(() => {
        router.push(route);
      }, delay);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to index route
      setTimeout(() => {
        router.replace('/');
      }, delay);
    }
  };

  return {
    safeReplace,
    safePush,
  };
} 