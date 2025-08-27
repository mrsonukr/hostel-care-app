# Global Offline Screen Feature

## Overview
The app now includes a **global offline screen system** that automatically displays when the user loses internet connectivity **anywhere in the app**. This feature provides a consistent user experience across all screens and clearly communicates the connection status with retry functionality.

## 🚀 Key Features

- **Global Coverage**: Works on **ALL screens** in the app, not just login/signup
- **Automatic Detection**: Real-time network connectivity monitoring
- **Consistent UI**: Same offline screen design across all screens
- **Smart Retry**: One-click connection checking
- **Performance Optimized**: Single network listener for entire app

## 🏗️ Architecture

### 1. **OfflineContext** (`contexts/OfflineContext.tsx`)
- **Global state management** for offline status
- **Single network listener** for entire app
- **Performance optimized** - no duplicate listeners

### 2. **OfflineScreen Component** (`components/OfflineScreen.tsx`)
- Beautiful offline screen with WiFi-off icon
- Customizable title and message
- Retry button with refresh icon
- Quick tips for resolving connection issues
- Responsive design for different screen sizes

### 3. **OfflineCheck Component** (`components/withOfflineCheck.tsx`)
- **HOC (Higher-Order Component)** for easy integration
- **Inline component** for flexible usage
- Automatic offline screen display

### 4. **OfflineUtils** (`utils/offlineUtils.ts`)
- Predefined messages and titles for common screens
- Utility functions for easy integration
- Consistent offline messaging across app

## 📱 Implementation

### Root Level Setup
The `OfflineProvider` is wrapped around the entire app in `app/_layout.tsx`:

```tsx
<ErrorBoundary>
  <OfflineProvider>        {/* ← Global offline management */}
    <AuthProvider>
      <SafeAreaProvider>
        <Stack />
      </SafeAreaProvider>
    </AuthProvider>
  </OfflineProvider>
</ErrorBoundary>
```

### Screen Level Usage

#### Method 1: Using OfflineCheck Component (Recommended)
```tsx
import { OfflineCheck } from '../../components/withOfflineCheck';

function MyScreenContent() {
  // Your screen logic here
  return <View>...</View>;
}

export default function MyScreen() {
  return (
    <OfflineCheck 
      message="Custom offline message for this screen"
      title="Offline - Screen Name"
    >
      <MyScreenContent />
    </OfflineCheck>
  );
}
```

#### Method 2: Using withOfflineCheck HOC
```tsx
import { withOfflineCheck } from '../../utils/offlineUtils';

function MyScreen() {
  return <View>...</View>;
}

export default withOfflineCheck(
  MyScreen,
  "Custom offline message",
  "Offline - Screen Name"
);
```

#### Method 3: Using Predefined Messages
```tsx
import { withOfflineCheck, OFFLINE_MESSAGES, OFFLINE_TITLES } from '../../utils/offlineUtils';

function MyScreen() {
  return <View>...</View>;
}

export default withOfflineCheck(
  MyScreen,
  OFFLINE_MESSAGES.COMPLAINTS.MAIN,
  OFFLINE_TITLES.COMPLAINTS.MAIN
);
```

## 🔧 Current Implementation Status

### ✅ Already Implemented
- **Login Screen** - Automatic offline detection
- **Signup Screen** - Automatic offline detection  
- **Complaint Screen** - Automatic offline detection
- **Root Layout** - Global offline provider

### 🎯 Easy to Add (Using Same Pattern)
- Profile screens
- Notification screens
- Settings screens
- Hostel selection screens
- Any other screen in the app

## 📋 How to Add Offline Support to Any Screen

### Step 1: Import OfflineCheck
```tsx
import { OfflineCheck } from '../../components/withOfflineCheck';
```

### Step 2: Wrap Your Component
```tsx
// Before
export default function MyScreen() {
  return <View>...</View>;
}

// After
function MyScreenContent() {
  return <View>...</View>;
}

export default function MyScreen() {
  return (
    <OfflineCheck 
      message="Custom offline message"
      title="Offline - Screen Name"
    >
      <MyScreenContent />
    </OfflineCheck>
  );
}
```

### Step 3: Customize Message (Optional)
```tsx
<OfflineCheck 
  message="You're offline. Can't access this feature right now."
  title="Connection Required"
>
  <MyScreenContent />
</OfflineCheck>
```

## 🎨 Customization Options

### OfflineScreen Props
- `onRetry`: Custom retry function
- `message`: Custom offline message
- `title`: Custom offline title
- `showRefreshIcon`: Toggle refresh icon

### Predefined Messages
Use `OFFLINE_MESSAGES` and `OFFLINE_TITLES` for consistent messaging:

```tsx
import { OFFLINE_MESSAGES, OFFLINE_TITLES } from '../../utils/offlineUtils';

<OfflineCheck 
  message={OFFLINE_MESSAGES.PROFILE.MAIN}
  title={OFFLINE_TITLES.PROFILE.MAIN}
>
  <ProfileScreen />
</OfflineCheck>
```

## 🔄 How It Works

1. **Global Detection**: `OfflineProvider` monitors network status for entire app
2. **State Management**: Single source of truth for offline status
3. **Automatic Display**: Any screen wrapped with `OfflineCheck` shows offline screen when needed
4. **Smart Retry**: Users can manually check connection status
5. **Seamless Experience**: Automatically returns to normal screen when online

## 📊 Benefits

- **No Duplicate Code**: Single network listener for entire app
- **Consistent UX**: Same offline screen design everywhere
- **Easy Maintenance**: Centralized offline logic
- **Performance**: No unnecessary re-renders or listeners
- **Scalable**: Easy to add to new screens

## 🚀 Future Enhancements

- Offline data caching
- Offline-first functionality
- Connection quality indicators
- Different offline scenarios (WiFi vs mobile data)
- Offline action queuing
- Background sync when online

## 📝 Example: Adding to Profile Screen

```tsx
// app/(protected)/profile-info.tsx
import { OfflineCheck } from '../../components/withOfflineCheck';

function ProfileInfoContent() {
  // Existing profile logic
  return <View>...</View>;
}

export default function ProfileInfo() {
  return (
    <OfflineCheck 
      message="You're offline. Can't view profile information right now."
      title="Offline - Profile"
    >
      <ProfileInfoContent />
    </OfflineCheck>
  );
}
```

That's it! The offline screen will automatically appear whenever the user is offline, regardless of which screen they're on.
