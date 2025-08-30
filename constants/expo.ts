/**
 * Expo Configuration Constants
 * 
 * This file contains Expo-specific configuration values
 * that are used across the application.
 */

/**
 * EAS Project ID for push notifications
 * This ID is required for generating valid Expo push tokens
 * in standalone builds and production environments.
 * 
 * Found in app.json under extra.eas.projectId
 */
export const EXPO_PROJECT_ID = 'ee0f715d-e80b-4875-ab8b-4b349f4f89da';

/**
 * Expo experience ID for push notifications
 * This ID is required for proper token generation in release builds
 */
export const EXPO_EXPERIENCE_ID = '@mrsonukr/hostelcare';

/**
 * Expo push token configuration
 */
export const EXPO_PUSH_CONFIG = {
  projectId: EXPO_PROJECT_ID,
  experienceId: EXPO_EXPERIENCE_ID,
} as const;
