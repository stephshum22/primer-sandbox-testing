import React, { useState } from 'react';
import CheckoutPage from './CheckoutPage';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const ProductPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPrimerCheckout, setShowPrimerCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  // Sample products
  const products: Product[] = [
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 199.99,
      description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
      image: '🎧',
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 299.99,
      description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
      image: '⌚',
      category: 'Electronics'
    },
    {
      id: '3',
      name: 'Coffee Maker',
      price: 89.99,
      description: 'Programmable coffee maker with thermal carafe and auto-shutoff',
      image: '☕',
      category: 'Home'
    },
    {
      id: '4',
      name: 'Yoga Mat',
      price: 49.99,
      description: 'Non-slip yoga mat with carrying strap and alignment lines',
      image: '🧘',
      category: 'Fitness'
    }
  ];

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    // Skip the CheckoutForm and go directly to Primer
    // Generate minimal checkout data as recommended by Primer docs
    const checkoutData = {
      orderId: 'order-' + Date.now(),
      amount: Math.round(getTotalPrice() * 100), // Convert to cents
      currencyCode: 'USD',
    };
    setCheckoutData(checkoutData);
    setShowPrimerCheckout(true);
  };

  const handleBackToProducts = () => {
    setShowPrimerCheckout(false);
    setCheckoutData(null);
  };

  if (showPrimerCheckout && checkoutData) {
    return (
      <CheckoutPage 
        cart={cart}
        totalPrice={getTotalPrice()}
        checkoutData={checkoutData}
        onBackToProducts={handleBackToProducts}
      />
    );
  }

  return (
    <div className="product-store">
      {/* Header */}
      <header className="store-header">
        <div className="container">
          <h1>🛍️ Primer Store</h1>
          <p>Test your payments with our beautiful product catalog</p>
        </div>
      </header>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="cart-summary">
          <div className="container">
            <div className="cart-info">
              <span className="cart-items">{getTotalItems()} items</span>
              <span className="cart-total">${getTotalPrice().toFixed(2)}</span>
              <button 
                className="checkout-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="container">
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <span className="product-emoji">{product.image}</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="product-category">{product.category}</span>
                  <span className="product-price">${product.price.toFixed(2)}</span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      {cart.length > 0 && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h3>Shopping Cart</h3>
            <span className="cart-count">{getTotalItems()} items</span>
          </div>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-emoji">{item.product.image}</span>
                  <div className="cart-item-details">
                    <h4>{item.product.name}</h4>
                    <p>${item.product.price.toFixed(2)} each</p>
                  </div>
                </div>
                <div className="cart-item-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total: ${getTotalPrice().toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn-large"
              onClick={handleProceedToCheckout}
            >
              Checkout with Primer
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="store-footer">
        <div className="container">
          <p>This is a sandbox environment for testing Primer payments</p>
          <div className="test-cards">
            <h4>Test Cards:</h4>
            <ul>
              <li><strong>Success:</strong> 4242 4242 4242 4242</li>
              <li><strong>Decline:</strong> 4000 0000 0000 0002</li>
              <li><strong>3D Secure:</strong> 4000 0025 0000 3155</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
