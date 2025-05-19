
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Only accept POST requests to the proxy endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: `Method ${req.method} not allowed. This endpoint only accepts POST requests.` 
    });
  }

  // Add CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const { endpoint = '', method = 'GET', data = null, params = {} } = req.body;

  const WOO_API_URL = process.env.WOOCOMMERCE_API_URL;
  const WOO_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const WOO_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!WOO_API_URL || !WOO_KEY || !WOO_SECRET) {
    return res.status(500).json({ error: 'WooCommerce API credentials not set' });
  }
  
  // Log request for debugging
  console.log(`📤 WooCommerce proxy forwarding ${method} request to: ${WOO_API_URL}/${endpoint}`);

  try {
    // Make the API request to WooCommerce
    const response = await axios({
      url: `${WOO_API_URL}/${endpoint}`,
      method,
      auth: { username: WOO_KEY, password: WOO_SECRET },
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? { ...params } : undefined,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (err: any) {
    const statusCode = err.response?.status || 500;
    const rawData = err.response?.data;

    // Catch unexpected HTML responses (e.g. login screen or Cloudflare page)
    if (typeof rawData === 'string' && rawData.trim().startsWith('<!DOCTYPE')) {
      console.error('❌ WooCommerce proxy error: Received HTML instead of JSON. Possible wrong API URL or missing credentials.');
      return res.status(502).json({
        error: 'WooCommerce returned an unexpected HTML response. Please check the API URL and credentials.',
        debug: 'Starts with "<!DOCTYPE"'
      });
    }

    // Detailed logging for specific error cases
    if (statusCode === 401) {
      console.error('🔐 WooCommerce authentication failed. Check API credentials.');
    } else if (statusCode === 404) {
      console.error(`🔍 WooCommerce endpoint not found: ${endpoint}`);
    } else if (statusCode === 405) {
      console.error(`⚠️ Method not allowed: ${method} for endpoint ${endpoint}`);
      console.error('Request details:', { url: `${WOO_API_URL}/${endpoint}`, method, params });
    }

    // Log and return WooCommerce error response
    console.error('WooCommerce API error:', statusCode, rawData);
    return res.status(statusCode).json({
      error: err.message || 'WooCommerce API proxy failed',
      statusCode,
      raw: rawData,
      requestDetails: {
        endpoint,
        method,
        apiUrl: WOO_API_URL
      }
    });
  }
}
