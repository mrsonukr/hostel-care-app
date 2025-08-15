# Notification API

Expo Push Notification API built with Cloudflare Workers and D1 Database.

## 🚀 Features

- Device token registration and management
- User token retrieval
- Device deactivation on logout
- Automatic cleanup of old tokens
- CORS support for cross-origin requests
- Comprehensive error handling

## 📋 API Endpoints

### 1. Register Device Token
**POST** `/api/register-device`

Login pe device token save karne ke liye.

**Request Body:**
```json
{
  "user_id": 123,
  "expo_token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "device_id": "iPhone14_ABC123",
  "device_type": "ios"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device registered successfully",
  "device_token_id": 456
}
```

### 2. Deactivate Device Token
**POST** `/api/deactivate-device`

Logout pe device token deactivate karne ke liye.

**Request Body:**
```json
{
  "user_id": 123,
  "device_id": "iPhone14_ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device deactivated successfully"
}
```

### 3. Get User Tokens
**GET** `/api/user-tokens/{user_id}`

User ke active tokens get karne ke liye.

**Response:**
```json
{
  "success": true,
  "tokens": [
    "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]"
  ]
}
```

### 4. Cleanup Old Tokens
**POST** `/api/cleanup-tokens`

30 days se purane inactive tokens ko delete karne ke liye.

**Response:**
```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "deleted_count": 5
}
```

### 5. Health Check
**GET** `/api/health`

API status check karne ke liye.

**Response:**
```json
{
  "status": "OK",
  "message": "Notification API is running"
}
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Run the SQL schema in your D1 database:
```bash
# Copy the contents of notifications.sql and run in your D1 database
```

### 3. Development
```bash
npm run dev
```

### 4. Deployment
```bash
npm run deploy
```

## 📱 Device Types

- `ios` - iPhone/iPad
- `android` - Android phones/tablets  
- `web` - Web browsers

## 🚨 Error Responses

### Device Not Found
```json
{
  "success": false,
  "error": "Device not found",
  "message": "No active device found for this user"
}
```

### Invalid Token
```json
{
  "success": false,
  "error": "Invalid token",
  "message": "Expo token is invalid or expired"
}
```

### Missing Fields
```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "user_id, expo_token, device_id, and device_type are required"
}
```

## 💻 Usage Examples

### JavaScript/Node.js
```javascript
// Register device
const registerDevice = async (userId, expoToken, deviceId, deviceType) => {
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/api/register-device', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      expo_token: expoToken,
      device_id: deviceId,
      device_type: deviceType
    })
  });
  return await response.json();
};

// Get user tokens
const getUserTokens = async (userId) => {
  const response = await fetch(`https://your-worker.your-subdomain.workers.dev/api/user-tokens/${userId}`);
  return await response.json();
};

// Deactivate device
const deactivateDevice = async (userId, deviceId) => {
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/api/deactivate-device', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      device_id: deviceId
    })
  });
  return await response.json();
};
```

### cURL Examples
```bash
# Register device
curl -X POST https://your-worker.your-subdomain.workers.dev/api/register-device \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "expo_token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "device_id": "iPhone14_ABC123",
    "device_type": "ios"
  }'

# Get user tokens
curl https://your-worker.your-subdomain.workers.dev/api/user-tokens/123

# Deactivate device
curl -X POST https://your-worker.your-subdomain.workers.dev/api/deactivate-device \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "device_id": "iPhone14_ABC123"
  }'
```

## 🗄️ Database Schema

The API uses the following database tables and functions:

- `device_tokens` - Stores device tokens for each user
- `notification_history` - Tracks notification delivery history
- `register_device_token()` - Function to register/update device tokens
- `deactivate_device_token()` - Function to deactivate device tokens
- `get_user_active_tokens()` - Function to get user's active tokens
- `cleanup_old_tokens()` - Function to cleanup old inactive tokens

## 🔒 Security Notes

- All endpoints support CORS for cross-origin requests
- Input validation is implemented for all endpoints
- Error messages are sanitized to prevent information leakage
- Database queries use parameterized statements to prevent SQL injection

## 📞 Support

For any issues or questions, please check the error responses and ensure all required fields are provided in the correct format.
