import { API_CONFIG } from '../constants/api';

export interface Notification {
  id: number;
  title: string;
  description: string;
  image: string | null;
  read: boolean;
  created_at: string;
  channel: 'complaint_status' | 'missing_product' | 'promotion';
  complaintId?: string;
  productId?: string;
  externalLink?: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  totalunread: number;
}

// Get all notifications with pagination
export const getNotifications = async (
  rollNo: string,
  limit: number = 50,
  offset: number = 0
): Promise<NotificationsResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}?roll_no=${rollNo}&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATION_READ}/${notificationId}/read`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Get unread count
export const getUnreadCount = async (rollNo: string): Promise<UnreadCountResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATION_COUNT}?roll_no=${rollNo}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${notificationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Delete multiple notifications
export const deleteMultipleNotifications = async (notificationIds: number[]): Promise<void> => {
  try {
    // Delete notifications one by one
    const deletePromises = notificationIds.map(id => deleteNotification(id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple notifications:', error);
    throw error;
  }
};
