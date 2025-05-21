import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  const {
    endpoint = '',
    method = 'GET',
    data = null,
    params = {}
  } = req.body;

  const WOO_API_URL = process.env.WOOCOMMERCE_API_URL || '';
  const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
  const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

  if (!WOO_API_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    return res.status(500).json({ error: 'Missing WooCommerce credentials' });
  }

  const oauth = new OAuth({
    consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const fullUrl = `${WOO_API_URL}/${endpoint}`;
const urlWithParams = method === 'GET' && Object.keys(params).length > 0
  ? `${fullUrl}?${new URLSearchParams(params).toString()}`
  : fullUrl;

const requestData = {
  url: urlWithParams,
  method,
};

const authHeader = oauth.toHeader(oauth.authorize(requestData));


  try {
    const response = await axios({
      method,
      url: urlWithParams,
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params: method === 'GET' ? params : undefined,
      data: method !== 'GET' ? data : undefined
    });

    res.status(200).json(response.data);
  } catch (err: any) {
    const statusCode = err.response?.status || 500;
    const rawData = err.response?.data;

    console.error('WooCommerce API error:', statusCode, rawData);
    res.status(statusCode).json({
      error: err.message,
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
