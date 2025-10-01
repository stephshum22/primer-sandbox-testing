import React, { useState, useEffect } from 'react';
import { Primer } from '@primer-io/checkout-web';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
  };
  quantity: number;
}

interface CheckoutPageProps {
  cart: CartItem[];
  totalPrice: number;
  onBackToProducts: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, totalPrice, onBackToProducts }) => {
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
        amount: Math.round(totalPrice * 100), // Convert to cents
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
      <div className="checkout-page">
        <div className="container">
          <div className="loading">
            <h2>Initializing checkout...</h2>
            <p>Setting up your secure payment form</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="error">
            <h2>Error: {error}</h2>
            <p>There was an issue setting up the checkout. This might be due to API configuration.</p>
            <div className="error-actions">
              <button onClick={() => window.location.reload()}>
                Try Again
              </button>
              <button onClick={onBackToProducts}>
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <button className="back-btn" onClick={onBackToProducts}>
            ← Back to Products
          </button>
          <h1>Secure Checkout</h1>
          <p>Complete your purchase with Primer's secure payment system</p>
        </div>

        <div className="checkout-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.product.id} className="order-item">
                  <div className="item-info">
                    <span className="item-emoji">{item.product.image}</span>
                    <div className="item-details">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="item-price">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-section">
            <h3>Payment Details</h3>
            {clientToken ? (
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
            ) : (
              <div className="payment-loading">
                <p>Loading payment form...</p>
              </div>
            )}
          </div>
        </div>

        <div className="sandbox-info">
          <h4>🧪 Sandbox Testing</h4>
          <p>Use these test card numbers to try different scenarios:</p>
          <div className="test-cards-grid">
            <div className="test-card success">
              <strong>✅ Success</strong>
              <code>4242 4242 4242 4242</code>
            </div>
            <div className="test-card decline">
              <strong>❌ Decline</strong>
              <code>4000 0000 0000 0002</code>
            </div>
            <div className="test-card 3d-secure">
              <strong>🔒 3D Secure</strong>
              <code>4000 0025 0000 3155</code>
            </div>
          </div>
          <p className="test-note">Use any future expiry date and any 3-digit CVC.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
