-- =====================================================
-- SIMPLE EXPO PUSH NOTIFICATION SCHEMA (SQLite Version)
-- =====================================================

-- Device tokens table for Expo push notifications
CREATE TABLE IF NOT EXISTS device_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    expo_token TEXT NOT NULL,
    device_id TEXT NOT NULL,
    device_type TEXT NOT NULL, -- 'ios', 'android', 'web'
    is_active INTEGER DEFAULT 1, -- SQLite uses INTEGER for boolean
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, device_id),
    UNIQUE(expo_token)
);

-- Notification history table
CREATE TABLE IF NOT EXISTS notification_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON device_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_expo_token ON device_tokens(expo_token);
CREATE INDEX IF NOT EXISTS idx_device_tokens_is_active ON device_tokens(is_active);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER IF NOT EXISTS update_device_tokens_updated_at 
    AFTER UPDATE ON device_tokens
    FOR EACH ROW
BEGIN
    UPDATE device_tokens SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample device tokens
INSERT OR IGNORE INTO device_tokens (user_id, expo_token, device_id, device_type) VALUES
(1, 'ExponentPushToken[sample_token_1]', 'iPhone14_ABC123', 'ios'),
(1, 'ExponentPushToken[sample_token_2]', 'Samsung_Galaxy_XYZ789', 'android'),
(2, 'ExponentPushToken[sample_token_3]', 'iPhone15_DEF456', 'ios'),
(3, 'ExponentPushToken[sample_token_4]', 'Chrome_Browser_GHI789', 'web');

-- Insert sample notification history
INSERT OR IGNORE INTO notification_history (user_id, title, body, notification_type) VALUES
(1, 'Welcome!', 'Welcome to our app!', 'welcome'),
(1, 'New Message', 'You have a new message', 'message'),
(2, 'Order Update', 'Your order has been shipped', 'order_update');
