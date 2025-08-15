import { Alert } from 'react-native';

export interface ErrorInfo {
  title: string;
  message: string;
  isNetworkError: boolean;
  shouldRetry: boolean;
}

export class AppError extends Error {
  public readonly isNetworkError: boolean;
  public readonly shouldRetry: boolean;
  public readonly userFriendlyTitle: string;
  public readonly userFriendlyMessage: string;

  constructor(
    message: string,
    isNetworkError: boolean = false,
    shouldRetry: boolean = true,
    userFriendlyTitle?: string,
    userFriendlyMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.isNetworkError = isNetworkError;
    this.shouldRetry = shouldRetry;
    this.userFriendlyTitle = userFriendlyTitle || 'Error';
    this.userFriendlyMessage = userFriendlyMessage || this.getDefaultMessage(isNetworkError);
  }

  private getDefaultMessage(isNetworkError: boolean): string {
    if (isNetworkError) {
      return 'Please check your internet connection and try again.';
    }
    return 'Something unexpected happened. Please try again.';
  }
}

export const errorHandler = {
  // Handle fetch errors and convert them to AppError
  handleFetchError: (error: any, context: string = 'operation'): AppError => {
    console.error(`Error in ${context}:`, error);

    // Network errors
    if (error.message?.includes('Network request failed') || 
        error.message?.includes('fetch') ||
        error.message?.includes('network') ||
        error.message?.includes('connection')) {
      return new AppError(
        `Network error in ${context}`,
        true,
        true,
        'Connection Error',
        'Please check your internet connection and try again.'
      );
    }

    // Timeout errors
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      return new AppError(
        `Timeout error in ${context}`,
        true,
        true,
        'Request Timeout',
        'The request took too long. Please try again.'
      );
    }

    // Server errors (5xx)
    if (error.status >= 500) {
      return new AppError(
        `Server error in ${context}`,
        false,
        true,
        'Server Error',
        'Our servers are experiencing issues. Please try again later.'
      );
    }

    // Client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      return new AppError(
        `Client error in ${context}`,
        false,
        false,
        'Request Error',
        'There was an issue with your request. Please check your input and try again.'
      );
    }

    // Unknown errors
    return new AppError(
      `Unknown error in ${context}`,
      false,
      true,
      'Unexpected Error',
      'Something unexpected happened. Please try again.'
    );
  },

  // Show error alert with retry option
  showErrorAlert: (
    error: AppError,
    onRetry?: () => void,
    onDismiss?: () => void
  ) => {
    const buttons = [
      { text: 'OK', onPress: onDismiss },
    ];

    if (error.shouldRetry && onRetry) {
      buttons.unshift({ text: 'Retry', onPress: onRetry });
    }

    Alert.alert(error.userFriendlyTitle, error.userFriendlyMessage, buttons);
  },

  // Handle async operations with error handling
  async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    context: string = 'operation',
    onError?: (error: AppError) => void,
    onRetry?: () => void
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error: any) {
      const appError = this.handleFetchError(error, context);
      
      if (onError) {
        onError(appError);
      } else {
        this.showErrorAlert(appError, onRetry);
      }
      
      return null;
    }
  },

  // Enhanced fetch wrapper with better error handling
  async fetchWithErrorHandling(
    url: string,
    options: RequestInit = {},
    context: string = 'API request'
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        throw error;
      }

      return response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new AppError(
          'Request timeout',
          true,
          true,
          'Request Timeout',
          'The request took too long. Please try again.'
        );
      }
      throw this.handleFetchError(error, context);
    }
  }
};

// Common error messages for different contexts
export const errorMessages = {
  login: {
    networkError: 'Unable to connect to server. Please check your internet connection.',
    invalidCredentials: 'Invalid username or password. Please try again.',
    serverError: 'Login service is temporarily unavailable. Please try again later.',
  },
  signup: {
    networkError: 'Unable to create account. Please check your internet connection.',
    duplicateUser: 'An account with this roll number already exists.',
    serverError: 'Account creation service is temporarily unavailable. Please try again later.',
  },
  profile: {
    networkError: 'Unable to load profile. Please check your internet connection.',
    updateError: 'Unable to update profile. Please try again.',
    serverError: 'Profile service is temporarily unavailable. Please try again later.',
  },
  complaints: {
    networkError: 'Unable to load complaints. Please check your internet connection.',
    submitError: 'Unable to submit complaint. Please try again.',
    serverError: 'Complaint service is temporarily unavailable. Please try again later.',
  },
  general: {
    networkError: 'Please check your internet connection and try again.',
    serverError: 'Service is temporarily unavailable. Please try again later.',
    unknownError: 'Something unexpected happened. Please try again.',
  }
};
