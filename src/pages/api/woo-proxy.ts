// /pages/api/woo-proxy.ts
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
      url: `${WOO_API_URL}/wp-json/wc/v3/${endpoint}`,
      method,
      auth: { username: WOO_KEY, password: WOO_SECRET },
      data,
      params
    });

    res.status(200).json(response.data);
  } catch (err: any) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
}