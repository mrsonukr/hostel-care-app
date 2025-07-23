import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { ApiResponse, StudentData } from '../types/navigation';

export class ApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error instanceof Error ? error : new Error('Network error occurred');
    }
  }

  static async login(username: string, password: string): Promise<ApiResponse<StudentData>> {
    return this.makeRequest<StudentData>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  static async signup(data: {
    roll_no: string;
    mobile_no: string;
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    return this.makeRequest(API_ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async forgotPassword(rollNumber: string): Promise<ApiResponse> {
    return this.makeRequest(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ roll_no: rollNumber }),
    });
  }

  static async verifyOTP(rollNumber: string, otp: string): Promise<ApiResponse> {
    return this.makeRequest(API_ENDPOINTS.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify({ roll_no: rollNumber, otp }),
    });
  }

  static async resetPassword(rollNumber: string, password: string): Promise<ApiResponse> {
    return this.makeRequest(API_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ roll_no: rollNumber, password }),
    });
  }
}