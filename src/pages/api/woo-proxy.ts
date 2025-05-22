import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  const {
    workflowUrl = '',
    payload = {},
  } = req.body;

  if (!workflowUrl) {
    return res.status(400).json({ error: 'Missing n8n workflow URL' });
  }

  try {
    const response = await axios.post(workflowUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    res.status(200).json(response.data);
  } catch (err: any) {
    const statusCode = err.response?.status || 500;
    const rawData = err.response?.data;

    console.error('n8n sync error:', statusCode, rawData);
    res.status(statusCode).json({
      error: err.message,
      statusCode,
      raw: rawData,
      requestDetails: {
        workflowUrl,
        payload
      }
    });
  }
}
