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

    // Complete request format based on Primer API docs
    const requestBody = {
      orderId,
      currencyCode,
      amount: amount,
      order: {
        countryCode: 'US',
        lineItems: [
          {
            itemId: 'test-item',
            description: 'Test Product',
            amount: amount,
            quantity: 1,
          },
        ],
      },
      customer: {
        emailAddress: 'test@example.com',
      },
      metadata: {
        source: 'sandbox-testing',
        environment: 'development',
      },
    };

    console.log('Making request to:', primerApiUrl);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    console.log('API Key (first 20 chars):', apiKey.substring(0, 20) + '...');

    const response = await axios.post(
      primerApiUrl,
      requestBody,
      {
        headers: {
          'X-Api-Version': '2.4',
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
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
