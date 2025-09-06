// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://sendnotification.mssonutech.workers.dev', // Working API URL
  ENDPOINTS: {
    NOTIFICATIONS: '/api/notifications',
    NOTIFICATION_READ: '/api/notifications',
    NOTIFICATION_COUNT: '/api/notifications/count',
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
