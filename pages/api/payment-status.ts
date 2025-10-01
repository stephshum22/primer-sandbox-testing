import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, orderId } = req.body;

    const primerApiUrl = `https://api.sandbox.primer.io/payments/${paymentId}`;
    const apiKey = process.env.PRIMER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Primer API key not configured' 
      });
    }

    const response = await axios.get(primerApiUrl, {
      headers: {
        'X-Api-Version': '2.4',
        'X-Api-Key': apiKey,
      },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      error: 'Failed to fetch payment',
      details: error.response?.data || error.message,
    });
  }
}
