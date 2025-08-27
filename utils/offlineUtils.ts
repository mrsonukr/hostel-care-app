import { OfflineCheck } from '../components/withOfflineCheck';

/**
 * Utility function to wrap any component with offline checking
 * @param Component - The component to wrap
 * @param message - Custom offline message
 * @param title - Custom offline title
 * @returns Wrapped component with offline checking
 */
export const withOfflineCheck = <P extends object>(
  Component: React.ComponentType<P>,
  message?: string,
  title?: string
) => {
  return (props: P) => (
    <OfflineCheck 
      message={message || "You're currently offline. Please check your internet connection and try again."}
      title={title || "No Internet Connection"}
    >
      <Component {...props} />
    </OfflineCheck>
  );
};

/**
 * Predefined offline messages for common screens
 */
export const OFFLINE_MESSAGES = {
  AUTH: {
    LOGIN: "You're currently offline. Please check your internet connection to continue with login.",
    SIGNUP: "You're currently offline. Please check your internet connection to continue with signup."
  },
  COMPLAINTS: {
    MAIN: "You're currently offline. Please check your internet connection to view and submit complaints.",
    DETAILS: "You're currently offline. Please check your internet connection to view complaint details."
  },
  PROFILE: {
    MAIN: "You're currently offline. Please check your internet connection to view your profile.",
    EDIT: "You're currently offline. Please check your internet connection to edit your profile."
  },
  NOTIFICATIONS: {
    MAIN: "You're currently offline. Please check your internet connection to view notifications."
  },
  SETTINGS: {
    MAIN: "You're currently offline. Please check your internet connection to access settings."
  },
  HOSTEL: {
    SELECTION: "You're currently offline. Please check your internet connection to select a hostel.",
    DETAILS: "You're currently offline. Please check your internet connection to view hostel details."
  }
};

/**
 * Predefined offline titles for common screens
 */
export const OFFLINE_TITLES = {
  AUTH: {
    LOGIN: "Offline - Login",
    SIGNUP: "Offline - Signup"
  },
  COMPLAINTS: {
    MAIN: "Offline - Complaints",
    DETAILS: "Offline - Complaint Details"
  },
  PROFILE: {
    MAIN: "Offline - Profile",
    EDIT: "Offline - Edit Profile"
  },
  NOTIFICATIONS: {
    MAIN: "Offline - Notifications"
  },
  SETTINGS: {
    MAIN: "Offline - Settings"
  },
  HOSTEL: {
    SELECTION: "Offline - Hostel Selection",
    DETAILS: "Offline - Hostel Details"
  }
};
