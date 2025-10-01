// Test with minimal request
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

    // Try the simplest possible request
    console.log('Testing with minimal request...');
    
    const testResponse = await axios.get(
      'https://api.sandbox.primer.io/',
      {
        headers: {
          'X-Api-Key': apiKey,
        },
        timeout: 5000,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Minimal request worked!',
      data: testResponse.data
    });

  } catch (error: any) {
    console.error('Minimal Test Error:', error.response?.data || error.message);
    
    res.status(500).json({
      error: 'Even minimal request failed',
      details: error.response?.data || error.message,
      status: error.response?.status,
      suggestion: 'This suggests an account-level issue. Try creating a new API key with full permissions or contact Primer support.'
    });
  }
}
