
/**
 * WooCommerce API Fetch Utility
 * 
 * A domain-aware fetch utility for making requests to the WooCommerce API
 * through the backend proxy.
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Makes a request to the WooCommerce API through the proxy
 * 
 * @param body Request body containing endpoint, method, params, and data
 * @returns The parsed JSON response
 * @throws Error if the request fails
 */
export const wooProxy = async (body: any) => {
  try {
    console.log(`🔄 WooCommerce API request to ${body.endpoint}`, body);
    
    const response = await fetch(`${API_BASE_URL}/api/woo-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // Add timeout handling with AbortController
      signal: AbortSignal.timeout(15000) // 15 seconds timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ WooCommerce API error (${response.status}):`, errorData);
      throw new Error(
        errorData.error || 
        `WooCommerce API failed with status ${response.status}`
      );
    }
    
    const data = await response.json();
    console.log(`✅ WooCommerce API response from ${body.endpoint}:`, data);
    return data;
  } catch (error) {
    // Check for network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      console.error('🌐 Network error connecting to WooCommerce API. Check backend server status.');
      throw new Error('Cannot connect to WooCommerce API server. Please check your backend connection.');
    }
    
    // Check for timeout errors
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
