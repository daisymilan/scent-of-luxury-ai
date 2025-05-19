
/**
 * WooCommerce API Fetch Utility
 * 
 * A domain-aware fetch utility for making requests to the WooCommerce API
 * through the backend proxy.
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
const MAX_RETRIES = 2;

/**
 * Makes a request to the WooCommerce API through the proxy
 * 
 * @param body Request body containing endpoint, method, params, and data
 * @param retryCount Number of retry attempts for transient issues
 * @returns The parsed JSON response
 * @throws Error if the request fails
 */
export const wooProxy = async (body: any, retryCount = 0) => {
  try {
    console.log(`🔄 WooCommerce API request to ${body.endpoint}`, body);
    console.log(`🔄 Using API base URL: ${API_BASE_URL}`);
    
    // Check for API URL configuration
    if (!API_BASE_URL) {
      console.error('❌ Missing VITE_BACKEND_URL environment variable');
      throw new Error('WooCommerce API URL not configured. Please check your environment variables.');
    }
    
    // Ensure method is set properly and normalized to uppercase
    const method = (body.method || 'GET').toUpperCase();
    
    // Verify that params is always an object
    const params = body.params || {};

    // Special handling for orders endpoint - always use GET
    const finalMethod = body.endpoint && body.endpoint.includes('orders') ? 'GET' : method;
    if (finalMethod !== method) {
      console.log(`⚠️ Using GET method for orders endpoint instead of ${method} to avoid 405 errors`);
    }
    
    // Change to use a POST request to the proxy endpoint, even for GET requests to WooCommerce
    const response = await fetch(`${API_BASE_URL}/api/woo-proxy`, {
      method: 'POST', // Always use POST for the proxy request
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        method: finalMethod, // Use our adjusted method that's safe for orders
        params: params, // Ensure params is defined
      }),
      // Add timeout handling with AbortController
      signal: AbortSignal.timeout(15000) // 15 seconds timeout
    });

    // Handle HTTP error responses
    if (!response.ok) {
      let errorMessage = `WooCommerce API failed with status ${response.status}`;
      let errorData = {};
      
      try {
        errorData = await response.json();
        console.error(`❌ WooCommerce API error (${response.status}):`, errorData);
      } catch (e) {
        // If we can't parse the response as JSON, just continue with the basic error
        console.error(`❌ WooCommerce API returned non-JSON error response:`, await response.text().catch(() => 'No response body'));
      }
      
      // Special handling for common error codes
      if (response.status === 404) {
        if (body.endpoint) {
          errorMessage = `WooCommerce API endpoint '${body.endpoint}' not found. Please verify the endpoint path.`;
        } else {
          errorMessage = 'WooCommerce API proxy endpoint not found. Please check your backend server configuration.';
        }
      } else if (response.status === 401) {
        errorMessage = 'WooCommerce API authentication failed. Please check your API credentials in environment variables.';
      } else if (response.status === 405) {
        errorMessage = `Method Not Allowed: The server rejected the ${method} method for ${body.endpoint}. This could indicate a CORS issue, proxy configuration problem, or the endpoint doesn't support this method.`;
        console.error(`❌ 405 Method Not Allowed Details:`, {
          requestMethod: method,
          endpoint: body.endpoint,
          proxyUrl: `${API_BASE_URL}/api/woo-proxy`,
          headers: Object.fromEntries([...response.headers.entries()]),
          params: params
        });
        
        // For 405 errors, retry with a different method if it makes sense
        // This is handled in the proxy now
      }
      
      throw new Error(
        (errorData as any)?.error || errorMessage
      );
    }
    
    const data = await response.json();
    console.log(`✅ WooCommerce API response from ${body.endpoint}:`, data);
    return data;
  } catch (error: any) {
    // Handle specific error types
    
    // Network errors - server down, CORS issues, etc.
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      console.error('🌐 Network error connecting to WooCommerce API. Check backend server status.');
      console.error(`🌐 Attempted to connect to: ${API_BASE_URL}/api/woo-proxy`);
      
      // Attempt to retry for network errors
      if (retryCount < MAX_RETRIES) {
        console.log(`🔄 Retrying WooCommerce API request (${retryCount + 1}/${MAX_RETRIES})...`);
        // Exponential backoff: 1s, 2s, 4s, etc.
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return wooProxy(body, retryCount + 1);
      }
      
      throw new Error(`Cannot connect to WooCommerce API server after ${MAX_RETRIES + 1} attempts. Please check your backend connection.`);
    }
    
    // Timeout errors
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.error('⏱️ WooCommerce API request timed out after 15 seconds.');
      throw new Error('WooCommerce API request timed out. The server may be overloaded or unavailable.');
    }
    
    // Rethrow other errors
    console.error('❌ WooCommerce API error:', error);
    throw error;
  }
};

/**
 * Test the WooCommerce API connection
 * 
 * @returns True if connection is successful
 * @throws Error if connection fails
 */
export const testWooConnection = async (): Promise<boolean> => {
  try {
    // Display connection info for debugging
    console.log(`🔗 Testing WooCommerce API connection to: ${API_BASE_URL}/api/woo-proxy`);
    
    await wooProxy({ 
      endpoint: 'products', 
      method: 'GET',
      params: { per_page: 1 }
    });
    console.log('✅ WooCommerce connection test successful');
    return true;
  } catch (error) {
    console.error('❌ WooCommerce connection test failed:', error);
    throw error;
  }
};

/**
 * Check if the WooCommerce API is properly configured
 * 
 * @returns True if configuration exists
 */
export const hasWooCommerceConfig = (): boolean => {
  return Boolean(API_BASE_URL);
};
