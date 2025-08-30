import { errorHandler, AppError } from './errorHandler';

const NOTIFICATION_BASE_URL = 'https://notification.mssonutech.workers.dev';

export interface DeviceRegistrationData {
  user_id: string;
  expo_token: string;
  device_id: string;
  device_type: 'ios' | 'android' | 'web';
}

export interface DeviceDeactivationData {
  user_id: string;
  device_id: string;
}

export interface NotificationApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  device_token_id?: number;
  tokens?: string[];
  deleted_count?: number;
}

export interface UserTokensResponse {
  success: boolean;
  tokens: string[];
  error?: string;
  message?: string;
}

class NotificationApi {
  private baseUrl: string;

  constructor(baseUrl: string = NOTIFICATION_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Register device token for push notifications
   */
  async registerDevice(data: DeviceRegistrationData): Promise<NotificationApiResponse> {
    try {
      // Validate required fields
      if (!data.user_id || !data.expo_token || !data.device_id || !data.device_type) {
        console.error('❌ Missing required fields:', data);
        return {
          success: false,
          error: 'Validation Error',
          message: 'Missing required fields: user_id, expo_token, device_id, or device_type'
        };
      }

      const response = await fetch(`${this.baseUrl}/api/register-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not ok:', response.status, response.statusText);
        console.error('Error response body:', errorText);
        return {
          success: false,
          error: `HTTP ${response.status}`,
          message: `Failed to register device: ${response.statusText} - ${errorText}`
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error in registerDevice API call:', error);
      return {
        success: false,
        error: 'Network Error',
        message: error.message || 'Failed to connect to notification service'
      };
    }
  }

  /**
   * Deactivate device token on logout
   */
  async deactivateDevice(data: DeviceDeactivationData): Promise<NotificationApiResponse> {
    try {

      
      const response = await fetch(`${this.baseUrl}/api/deactivate-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        return {
          success: false,
          error: `HTTP ${response.status}`,
          message: `Failed to deactivate device: ${response.statusText}`
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error in deactivateDevice API call:', error);
      return {
        success: false,
        error: 'Network Error',
        message: error.message || 'Failed to connect to notification service'
      };
    }
  }

  /**
   * Get user's active device tokens
   */
  async getUserTokens(userId: string): Promise<UserTokensResponse> {
    try {

      
      const response = await fetch(`${this.baseUrl}/api/user-tokens/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        return {
          success: false,
          tokens: [],
          error: `HTTP ${response.status}`,
          message: `Failed to get user tokens: ${response.statusText}`
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error in getUserTokens API call:', error);
      return {
        success: false,
        tokens: [],
        error: 'Network Error',
        message: error.message || 'Failed to connect to notification service'
      };
    }
  }

  /**
   * Cleanup old inactive tokens (admin function)
   */
  async cleanupTokens(): Promise<NotificationApiResponse> {
    try {
      const response = await errorHandler.fetchWithErrorHandling(
        `${this.baseUrl}/api/cleanup-tokens`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        'cleanup-tokens'
      );

      return await response.json();
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw errorHandler.handleFetchError(error, 'cleanup-tokens');
    }
  }

  /**
   * Health check for notification API
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('❌ Health check failed:', response.status, response.statusText);
        return {
          status: 'error',
          message: `API health check failed: ${response.status} ${response.statusText}`
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('❌ Health check error:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to connect to notification service'
      };
    }
  }
}

// Export singleton instance
export const notificationApi = new NotificationApi();

// Export the class for testing purposes
export { NotificationApi };
