import React, { useState, useEffect } from 'react';
import Script from 'next/script';

// Declare Primer global
declare global {
  interface Window {
    Primer: any;
  }
}

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
  checkoutData: any;
  onBackToProducts: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, totalPrice, checkoutData, onBackToProducts }) => {
  const [clientToken, setClientToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [primerLoaded, setPrimerLoaded] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
    setIsLoading(false); // Show the checkout form immediately
  }, []);

  // Initialize Primer checkout when both client and SDK are ready
  useEffect(() => {
    if (!isClient || !primerLoaded || !clientToken) return;
    
    // Add a small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      const initializePrimerCheckout = () => {
        const container = document.querySelector('.primer-checkout-container');
      
      if (window.Primer && container) {
        try {
          window.Primer.showUniversalCheckout(clientToken, {
            container: '.primer-checkout-container',
            onCheckoutComplete: handlePaymentSuccess,
            onCheckoutFail: handlePaymentError,
          });
        } catch (error) {
          console.error('Error initializing Primer checkout:', error);
          setError('Failed to initialize Primer checkout');
        }
      } else if (window.Primer && !container) {
        // Retry if DOM element isn't ready yet
        setTimeout(() => {
          if (document.querySelector('.primer-checkout-container')) {
            initializePrimerCheckout();
          }
        }, 1000);
      }
    };

      initializePrimerCheckout();
    }, 500); // Wait 500ms for DOM to be ready
    
    return () => clearTimeout(timeoutId);
  }, [isClient, primerLoaded, clientToken]);

  // Get client token and load SDK
  useEffect(() => {
    if (!isClient) return;
    
    const getToken = async () => {
      try {
        const token = await fetchClientToken();
        setClientToken(token);
        
        // If Script component didn't load SDK, try manual loading
        setTimeout(() => {
          if (!window.Primer) {
            const script = document.createElement('script');
            script.src = 'https://sdk.primer.io/web/v2.57.3/Primer.min.js';
            script.async = true;
            script.onload = () => setPrimerLoaded(true);
            script.onerror = () => setError('Failed to load Primer SDK');
            document.head.appendChild(script);
          }
        }, 2000);
        
      } catch (err) {
        console.error('Failed to get client token:', err);
        setError('Failed to initialize checkout');
      }
    };

    getToken();
  }, [isClient]);

  const fetchClientToken = async (): Promise<string> => {
    // Use the checkout data collected from the form
    const response = await fetch('/api/client-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: checkoutData.orderId,
        amount: checkoutData.amount,
        currencyCode: checkoutData.currencyCode,
        customerEmail: checkoutData.customerEmail,
        customerName: checkoutData.customerName,
        billingAddress: checkoutData.billingAddress,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create client session');
    }

    const data = await response.json();
    return data.clientToken;
  };

  const handlePaymentSuccess = ({ payment }: any) => {
    console.log('Checkout Complete!', payment);
    // Handle successful payment
    alert('Payment successful! Check console for details.');
  };

  const handlePaymentError = (error: any, { payment }: any, handler: any) => {
    console.log('Checkout Fail!', error, payment);
    // Handle payment error
    alert('Payment failed. Check console for details.');
    
    // If handler exists, show error message
    if (handler) {
      handler.showErrorMessage();
    }
  };

  if (!isClient) {
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
      <Script
        src="https://sdk.primer.io/web/v2.57.3/Primer.min.js"
        strategy="afterInteractive"
        onLoad={() => setPrimerLoaded(true)}
        onError={() => setError('Failed to load Primer SDK')}
      />
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
            <div className="primer-checkout-container"></div>
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
