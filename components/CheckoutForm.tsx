import React, { useState } from 'react';

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

interface CheckoutFormProps {
  cart: CartItem[];
  totalPrice: number;
  onProceedToPrimer: (checkoutData: CheckoutData) => void;
  onBackToProducts: () => void;
}

interface CheckoutData {
  orderId: string;
  currencyCode: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
    countryCode: string;
  };
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  cart, 
  totalPrice, 
  onProceedToPrimer, 
  onBackToProducts 
}) => {
  const [formData, setFormData] = useState<CheckoutData>({
    orderId: `ORDER-${Date.now()}`,
    currencyCode: 'USD',
    amount: Math.round(totalPrice * 100), // Convert to cents
    customerEmail: '',
    customerName: '',
    billingAddress: {
      firstName: '',
      lastName: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      countryCode: 'US',
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CheckoutData],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToPrimer(formData);
  };

  return (
    <div className="checkout-form-page">
      <div className="container">
        <div className="checkout-header">
          <button className="back-btn" onClick={onBackToProducts}>
            ← Back to Products
          </button>
          <h1>Checkout Information</h1>
          <p>Please provide the required information to complete your order</p>
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

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Order Details</h3>
              <div className="form-group">
                <label htmlFor="orderId">Order ID</label>
                <input
                  type="text"
                  id="orderId"
                  value={formData.orderId}
                  onChange={(e) => handleInputChange('orderId', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="currencyCode">Currency</label>
                <select
                  id="currencyCode"
                  value={formData.currencyCode}
                  onChange={(e) => handleInputChange('currencyCode', e.target.value)}
                  required
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Customer Information</h3>
              <div className="form-group">
                <label htmlFor="customerEmail">Email Address</label>
                <input
                  type="email"
                  id="customerEmail"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerName">Full Name</label>
                <input
                  type="text"
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Billing Address</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.billingAddress.firstName}
                    onChange={(e) => handleInputChange('billingAddress.firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.billingAddress.lastName}
                    onChange={(e) => handleInputChange('billingAddress.lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="addressLine1">Address Line 1</label>
                <input
                  type="text"
                  id="addressLine1"
                  value={formData.billingAddress.addressLine1}
                  onChange={(e) => handleInputChange('billingAddress.addressLine1', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.billingAddress.city}
                    onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    value={formData.billingAddress.state}
                    onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.billingAddress.zipCode}
                    onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="countryCode">Country</label>
                <select
                  id="countryCode"
                  value={formData.billingAddress.countryCode}
                  onChange={(e) => handleInputChange('billingAddress.countryCode', e.target.value)}
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>

            <button type="submit" className="proceed-btn">
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
