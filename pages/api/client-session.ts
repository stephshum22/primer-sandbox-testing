// API route to create Primer client sessions
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
    const { orderId, amount, currencyCode } = req.body;

    // Primer sandbox API endpoint
    const primerApiUrl = 'https://api.sandbox.primer.io/client-session';
    
    // You'll need to get your API key from Primer Dashboard
    const apiKey = process.env.PRIMER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Primer API key not configured. Please set PRIMER_API_KEY environment variable.' 
      });
    }

    const response = await axios.post(
      primerApiUrl,
      {
        orderId,
        order: {
          currencyCode,
          lineItems: [
            {
              itemId: 'test-item',
              description: 'Test Product',
              amount: amount,
              quantity: 1,
            },
          ],
        },
        // Configure payment methods for sandbox
        paymentMethod: {
          options: {
            card: {
              threeDSecure: true,
            },
          },
        },
      },
      {
        headers: {
          'X-Api-Version': '2.4',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      clientToken: response.data.clientToken,
      orderId: response.data.orderId,
    });
  } catch (error: any) {
    console.error('Error creating client session:', error);
    res.status(500).json({
      error: 'Failed to create client session',
      details: error.response?.data || error.message,
    });
  }
}
