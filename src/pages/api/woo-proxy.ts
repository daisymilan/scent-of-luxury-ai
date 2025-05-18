import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint = '', method = 'GET', data = null, params = {} } = req.body;

  const WOO_API_URL = process.env.WOOCOMMERCE_API_URL;
  const WOO_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const WOO_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!WOO_API_URL || !WOO_KEY || !WOO_SECRET) {
    return res.status(500).json({ error: 'WooCommerce API credentials not set' });
  }

  try {
    const response = await axios({
      url: `${WOO_API_URL}/${endpoint}`,
      method,
      auth: { username: WOO_KEY, password: WOO_SECRET },
      data,
      params
    });

    res.status(200).json(response.data);
  } catch (err: any) {
    const rawData = err.response?.data;

    // Catch unexpected HTML responses (e.g. login screen or Cloudflare page)
    if (typeof rawData === 'string' && rawData.trim().startsWith('<!DOCTYPE')) {
      console.error('❌ WooCommerce proxy error: Received HTML instead of JSON. Possible wrong API URL or missing credentials.');
      return res.status(502).json({
        error: 'WooCommerce returned an unexpected HTML response. Please check the API URL and credentials.',
        debug: 'Starts with "<!DOCTYPE"'
      });
    }

    // Log and return WooCommerce error response
    console.error('WooCommerce API error:', err.response?.status, rawData);
    return res.status(err.response?.status || 500).json({
      error: err.message || 'WooCommerce API proxy failed',
      raw: rawData
    });
  }
}
