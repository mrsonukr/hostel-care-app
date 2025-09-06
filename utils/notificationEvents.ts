// Simple event emitter for React Native
class NotificationEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(...args));
  }
}

export const notificationEvents = new NotificationEventEmitter();

// Event types
export const NOTIFICATION_EVENTS = {
  UNREAD_COUNT_CHANGED: 'unreadCountChanged',
  NOTIFICATION_READ: 'notificationRead',
  NOTIFICATION_DELETED: 'notificationDeleted',
} as const;
