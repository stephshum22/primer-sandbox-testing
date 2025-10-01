import React, { useState, useEffect, useRef } from 'react';
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
  const primerRef = useRef<HTMLDivElement>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Primer checkout when both client and SDK are ready
  useEffect(() => {
    if (!isClient || !primerLoaded || !clientToken) return;
    
    const initializePrimerCheckout = () => {
      console.log('Initializing Primer checkout...');
      console.log('Window.Primer available:', !!window.Primer);
      console.log('PrimerRef current:', !!primerRef.current);
      
      if (window.Primer && primerRef.current) {
        try {
          window.Primer.showUniversalCheckout({
            clientToken: clientToken,
            container: primerRef.current,
            onCheckoutComplete: handlePaymentSuccess,
            onCheckoutError: handlePaymentError,
            appearance: {
              theme: 'light',
              variables: {
                colorPrimary: '#007bff',
                colorBackground: '#ffffff',
                colorText: '#333333',
                borderRadius: '8px',
              },
            },
          });
          console.log('Primer checkout initialized successfully');
          setIsLoading(false);
        } catch (error) {
          console.error('Error initializing Primer checkout:', error);
          setError('Failed to initialize Primer checkout');
          setIsLoading(false);
        }
      } else {
        console.error('Missing requirements for Primer checkout:', {
          windowPrimer: !!window.Primer,
          primerRef: !!primerRef.current
        });
        
        // Wait a bit and try again if DOM element isn't ready
        if (window.Primer && !primerRef.current) {
          console.log('DOM element not ready, retrying in 1000ms...');
          setTimeout(() => {
            // Check if element exists in DOM
            const element = document.querySelector('.primer-checkout-container');
            console.log('DOM element found:', !!element);
            console.log('PrimerRef current:', !!primerRef.current);
            
            if (primerRef.current || element) {
              console.log('DOM element found on retry, initializing...');
              initializePrimerCheckout();
            } else {
              console.error('DOM element still not found after retry');
              // Try to create the element manually
              const container = document.querySelector('.payment-section');
              if (container) {
                const newElement = document.createElement('div');
                newElement.className = 'primer-checkout-container';
                container.appendChild(newElement);
                console.log('Created DOM element manually, retrying...');
                setTimeout(() => initializePrimerCheckout(), 100);
              } else {
                setError('Failed to load Primer SDK - DOM element not found');
                setIsLoading(false);
              }
            }
          }, 1000);
        } else {
          setError('Failed to load Primer SDK');
          setIsLoading(false);
        }
      }
    };

    initializePrimerCheckout();
  }, [isClient, primerLoaded, clientToken]);

  // Get client token and load SDK
  useEffect(() => {
    if (!isClient) return;
    
    const getToken = async () => {
      try {
        const token = await fetchClientToken();
        setClientToken(token);
        console.log('Client token obtained:', token.substring(0, 20) + '...');
        
        // If Script component didn't load SDK, try manual loading
        setTimeout(() => {
          if (!window.Primer) {
            console.log('Script component failed, trying manual SDK loading...');
            const script = document.createElement('script');
            script.src = 'https://sdk.primer.io/web/v1.41.1/Primer.min.js';
            script.async = true;
            script.onload = () => {
              console.log('Manual SDK loading successful');
              setPrimerLoaded(true);
            };
            script.onerror = () => {
              console.error('Manual SDK loading failed');
              setError('Failed to load Primer SDK');
              setIsLoading(false);
            };
            document.head.appendChild(script);
          }
        }, 2000); // Wait 2 seconds for Script component
        
      } catch (err) {
        console.error('Failed to get client token:', err);
        setError('Failed to initialize checkout');
        setIsLoading(false);
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

  if (!isClient || isLoading) {
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
        src="https://sdk.primer.io/web/v1.41.1/Primer.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Primer SDK loaded successfully');
          setPrimerLoaded(true);
        }}
        onError={() => {
          console.error('Failed to load Primer SDK');
          setError('Failed to load Primer SDK');
          setIsLoading(false);
        }}
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
            <div ref={primerRef} className="primer-checkout-container">
              {isLoading && (
                <div className="payment-loading">
                  <p>Loading Primer checkout...</p>
                </div>
              )}
            </div>
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
