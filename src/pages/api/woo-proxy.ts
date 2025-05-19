
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

  // Now accept both GET and POST requests to the proxy endpoint
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ 
      error: `Method ${req.method} not allowed. This endpoint only accepts GET and POST requests.` 
    });
  }

  // Add CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Extract WooCommerce request details - handle both GET and POST
  let endpoint, method, data, params;
  
  if (req.method === 'GET') {
    // For GET requests to the proxy, extract data from query parameters
    endpoint = req.query.endpoint as string || '';
    method = req.query.method as string || 'GET';
    params = req.query.params ? JSON.parse(req.query.params as string) : {};
    data = null;
  } else {
    // For POST requests, extract from body
    const { endpoint: bodyEndpoint = '', method: bodyMethod = 'GET', data: bodyData = null, params: bodyParams = {} } = req.body;
    endpoint = bodyEndpoint;
    method = bodyMethod;
    data = bodyData;
    params = bodyParams;
  }

  const WOO_API_URL = process.env.WOOCOMMERCE_API_URL;
  const WOO_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const WOO_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!WOO_API_URL || !WOO_KEY || !WOO_SECRET) {
    return res.status(500).json({ error: 'WooCommerce API credentials not set' });
  }

  // Log request for debugging
  console.log(`📤 WooCommerce proxy forwarding ${method} request to: ${WOO_API_URL}/${endpoint}`);
  console.log('Request params:', params);
  console.log('Request method:', method);
  console.log('Request origin:', req.headers.origin || 'Unknown');

  try {
    // Always use GET for WooCommerce orders endpoint to avoid 405 errors
    const finalMethod = endpoint.includes('orders') ? 'GET' : method;
    if (finalMethod !== method) {
      console.log(`⚠️ Overriding method ${method} to ${finalMethod} for endpoint ${endpoint} to avoid 405 errors`);
    }

    const response = await axios({
      url: `${WOO_API_URL}/${endpoint}`,
      method: finalMethod,
      auth: { username: WOO_KEY, password: WOO_SECRET },
      data: finalMethod !== 'GET' ? data : undefined,
      params: finalMethod === 'GET' ? { ...params } : undefined,
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

    if (statusCode === 401) {
      console.error('🔐 WooCommerce authentication failed. Check API credentials.');
    } else if (statusCode === 404) {
      console.error(`🔍 WooCommerce endpoint not found: ${endpoint}`);
    } else if (statusCode === 405) {
      console.error(`⚠️ Method not allowed: ${method} for endpoint ${endpoint}`);
      console.error('Request details:', { url: `${WOO_API_URL}/${endpoint}`, method, params });
      
      // If 405 error occurs for a method that isn't GET, try again with GET
      if (method !== 'GET' && !req.headers['x-retry-with-get']) {
        console.log('🔄 Retrying with GET method instead');
        try {
          const retryResponse = await axios({
            url: `${WOO_API_URL}/${endpoint}`,
            method: 'GET',
            auth: { username: WOO_KEY, password: WOO_SECRET },
            params: { ...params, ...(data || {}) },
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          return res.status(200).json({
            data: retryResponse.data,
            warning: 'Original request resulted in 405 Method Not Allowed, automatically retried with GET method'
          });
        } catch (retryErr: any) {
          console.error('❌ Retry with GET failed:', retryErr.message);
        }
      }
    }

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
