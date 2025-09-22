// utils/passwordApi.ts
import { errorHandler, AppError } from './errorHandler';

const API_BASE_URL = 'https://hostelapis.mssonutech.workers.dev';

export interface ChangePasswordData {
  roll_no: string;
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const changePassword = async (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
  try {
    const response = await errorHandler.fetchWithErrorHandling(
      `${API_BASE_URL}/api/change-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      'changing password'
    );

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to change password');
    }

    return {
      success: true,
      message: result.message || 'Password changed successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

export const forgotPassword = async (roll_no: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await errorHandler.fetchWithErrorHandling(
      `${API_BASE_URL}/api/forget-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roll_no }),
      },
      'sending password reset'
    );

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send password reset');
    }

    return {
      success: true,
      message: result.message || 'Password reset instructions sent to your registered email'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};
