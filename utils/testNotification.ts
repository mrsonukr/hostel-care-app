import { notificationApi } from './notificationApi';
import { notificationService } from './notificationService';

export async function testNotificationSystem() {

  
  try {
    // Test 1: Health Check

    const health = await notificationApi.healthCheck();
    
    
    // Test 2: Initialize Notification Service
    
    await notificationService.initialize();
    
    
    // Test 3: Check Current Token
    const token = notificationService.getCurrentToken();
    const deviceId = notificationService.getCurrentDeviceId();
    
    
    // Test 4: Check Permissions
    const enabled = await notificationService.areNotificationsEnabled();
    
    
    // Test 5: Send Test Notification
    if (enabled) {

      await notificationService.sendLocalNotification(
        'Test Notification',
        'This is a test notification from HostelCare!'
      );
      
    }
    

    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

export async function testDeviceRegistration(rollNo: string) {
  try {
    // Test device registration
    const success = await notificationService.registerDevice(rollNo);
    
    // Test getting user tokens
    const response = await notificationApi.getUserTokens(rollNo);
    
    return success;
  } catch (error) {
    console.error('❌ Device registration test failed:', error);
    return false;
  }
}
