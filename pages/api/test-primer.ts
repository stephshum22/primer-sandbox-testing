// Simple API test endpoint
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.PRIMER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'No API key found' 
      });
    }

    // Test 1: Simple GET request to check API key validity
    console.log('Testing API key:', apiKey.substring(0, 20) + '...');
    
    const testResponse = await axios.get(
      'https://api.sandbox.primer.io/payments',
      {
        headers: {
          'X-Api-Version': '2.4',
          'X-Api-Key': apiKey,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: 'API key is working!',
      data: testResponse.data
    });

  } catch (error: any) {
    console.error('API Test Error:', error.response?.data || error.message);
    
    res.status(500).json({
      error: 'API test failed',
      details: error.response?.data || error.message,
      status: error.response?.status,
      headers: error.response?.headers
    });
  }
}
