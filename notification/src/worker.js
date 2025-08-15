/**
 * Notification API for Expo Push Notifications
 * Cloudflare Workers with D1 Database (SQLite)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (path === '/api/register-device' && method === 'POST') {
        return await handleRegisterDevice(request, env, corsHeaders);
      } else if (path === '/api/deactivate-device' && method === 'POST') {
        return await handleDeactivateDevice(request, env, corsHeaders);
      } else if (path.startsWith('/api/user-tokens/') && method === 'GET') {
        const userId = path.split('/').pop();
        return await handleGetUserTokens(userId, env, corsHeaders);
      } else if (path === '/api/cleanup-tokens' && method === 'POST') {
        return await handleCleanupTokens(env, corsHeaders);
      } else if (path === '/api/health' && method === 'GET') {
        return new Response(JSON.stringify({ status: 'OK', message: 'Notification API is running' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Not Found', 
          message: 'Endpoint not found' 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Internal Server Error', 
        message: 'Something went wrong' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Register device token
async function handleRegisterDevice(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { user_id, expo_token, device_id, device_type } = body;

    // Validation
    if (!user_id || !expo_token || !device_id || !device_type) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields',
        message: 'user_id, expo_token, device_id, and device_type are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate device type
    const validDeviceTypes = ['ios', 'android', 'web'];
    if (!validDeviceTypes.includes(device_type)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid device type',
        message: 'device_type must be one of: ios, android, web'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if device already exists for this user
    const existingDevice = await env.hostel.prepare(`
      SELECT id FROM device_tokens 
      WHERE user_id = ? AND device_id = ?
    `).bind(user_id, device_id).first();

    let deviceTokenId;

    if (existingDevice) {
      // Update existing device
      const result = await env.hostel.prepare(`
        UPDATE device_tokens 
        SET expo_token = ?, device_type = ?, is_active = 1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND device_id = ?
        RETURNING id
      `).bind(expo_token, device_type, user_id, device_id).first();
      
      deviceTokenId = existingDevice.id;
    } else {
      // Insert new device
      const result = await env.hostel.prepare(`
        INSERT INTO device_tokens (user_id, expo_token, device_id, device_type)
        VALUES (?, ?, ?, ?)
        RETURNING id
      `).bind(user_id, expo_token, device_id, device_type).first();
      
      deviceTokenId = result.id;
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Device registered successfully',
      device_token_id: deviceTokenId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Register device error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Registration failed',
      message: 'Failed to register device token'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Deactivate device token
async function handleDeactivateDevice(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { user_id, device_id } = body;

    // Validation
    if (!user_id || !device_id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields',
        message: 'user_id and device_id are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // First check if device exists and is active
    const deviceCheck = await env.hostel.prepare(`
      SELECT id, is_active FROM device_tokens 
      WHERE user_id = ? AND device_id = ?
    `).bind(parseInt(user_id), device_id).first();

    if (!deviceCheck) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Device not found',
        message: 'No device found for this user'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (deviceCheck.is_active === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Device already deactivated',
        message: 'Device is already deactivated'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Deactivate device
    const result = await env.hostel.prepare(`
      UPDATE device_tokens 
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND device_id = ? AND is_active = 1
    `).bind(parseInt(user_id), device_id).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Device deactivated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Deactivate device error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Deactivation failed',
      message: 'Failed to deactivate device token'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Get user's active tokens
async function handleGetUserTokens(userId, env, corsHeaders) {
  try {
    // Validation
    if (!userId || isNaN(userId)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid user ID',
        message: 'Valid user ID is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get active tokens
    const tokens = await env.hostel.prepare(`
      SELECT expo_token FROM device_tokens
      WHERE user_id = ? AND is_active = 1
    `).bind(parseInt(userId)).all();

    return new Response(JSON.stringify({
      success: true,
      tokens: tokens.results.map(row => row.expo_token)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get user tokens error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get tokens',
      message: 'Failed to retrieve user tokens'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Cleanup old tokens
async function handleCleanupTokens(env, corsHeaders) {
  try {
    const result = await env.hostel.prepare(`
      DELETE FROM device_tokens 
      WHERE is_active = 0 
      AND updated_at < datetime('now', '-30 days')
    `).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Cleanup completed successfully',
      deleted_count: result.changes
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Cleanup tokens error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Cleanup failed',
      message: 'Failed to cleanup old tokens'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}