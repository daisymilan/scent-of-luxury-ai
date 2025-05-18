
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
  const response = await fetch(`${API_BASE_URL}/api/woo-proxy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || 
      `WooCommerce API failed with status ${response.status}`
    );
  }
  
  return response.json();
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
    return true;
  } catch (error) {
    console.error('WooCommerce connection test failed:', error);
    throw error;
  }
};
