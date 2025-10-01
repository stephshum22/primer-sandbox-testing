import React, { useState, useEffect } from 'react';
import { Primer } from '@primer-io/checkout-web';

interface CheckoutPageProps {}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
  const [clientToken, setClientToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Initialize Primer checkout
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // In a real implementation, you'd get this from your backend
        // For sandbox, you can use Primer's test client token
        const token = await fetchClientToken();
        setClientToken(token);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize checkout');
        setIsLoading(false);
      }
    };

    initializeCheckout();
  }, []);

  const fetchClientToken = async (): Promise<string> => {
    // This would typically come from your backend API
    // For sandbox testing, you can use Primer's test credentials
    const response = await fetch('/api/client-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Add any order details here
        orderId: 'test-order-' + Date.now(),
        amount: 1000, // $10.00 in cents
        currencyCode: 'USD',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create client session');
    }

    const data = await response.json();
    return data.clientToken;
  };

  const handlePaymentSuccess = (payment: any) => {
    console.log('Payment successful:', payment);
    // Handle successful payment
    alert('Payment successful! Check console for details.');
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    // Handle payment error
    alert('Payment failed. Check console for details.');
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Initializing checkout...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>Error: {error}</h2>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="checkout-header">
        <h1>Primer Checkout Sandbox</h1>
        <p>Test your payment integration with Primer's sandbox environment</p>
      </div>

      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-item">
            <span>Test Product</span>
            <span>$10.00</span>
          </div>
          <div className="order-total">
            <span>Total</span>
            <span>$10.00</span>
          </div>
        </div>

        <div className="payment-section">
          <h3>Payment Details</h3>
          {clientToken && (
            <Primer
              clientToken={clientToken}
              onCheckoutComplete={handlePaymentSuccess}
              onCheckoutError={handlePaymentError}
              appearance={{
                theme: 'light',
                variables: {
                  colorPrimary: '#007bff',
                  colorBackground: '#ffffff',
                  colorText: '#333333',
                  borderRadius: '8px',
                },
              }}
            />
          )}
        </div>
      </div>

      <div className="sandbox-info">
        <h4>Sandbox Testing</h4>
        <p>Use these test card numbers:</p>
        <ul>
          <li><strong>Success:</strong> 4242 4242 4242 4242</li>
          <li><strong>Decline:</strong> 4000 0000 0000 0002</li>
          <li><strong>3D Secure:</strong> 4000 0025 0000 3155</li>
        </ul>
        <p>Use any future expiry date and any 3-digit CVC.</p>
      </div>
    </div>
  );
};

export default CheckoutPage;
