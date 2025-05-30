import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/checkout/CheckoutForm'; // Import CheckoutForm
// import OrderSummary from '../components/checkout/OrderSummary'; // Assuming summary component
// import ProgressIndicator from '../components/checkout/ProgressIndicator'; // Assuming progress component
import { orderService } from '../services/orderService'; // Import orderService
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// Define types for form data
interface PersonalInfoData { name?: string; email?: string; phone?: string; [key: string]: any; }
interface AddressData { address1?: string; address2?: string; city?: string; state?: string; zip?: string; country?: string; [key: string]: any; }

const CheckoutPage = () => {
  const { cart, loading, error: cartError, clearCart } = useCart();
  const navigate = useNavigate();

  // State to manage form data and validity for each section
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({});
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<AddressData>({});
  const [isShippingAddressValid, setIsShippingAddressValid] = useState(false);

  const [billingAddress, setBillingAddress] = useState<AddressData>({});
  const [isBillingAddressValid, setIsBillingAddressValid] = useState(false);

  // State to manage overall form validity and order placement process
  const [isOverallFormValid, setIsOverallFormValid] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // New state for loading during order placement
  const [placeOrderError, setPlaceOrderError] = useState<string | null>(null); // New state for order placement errors

  // Update overall validity whenever individual form validity changes
  useEffect(() => {
    setIsOverallFormValid(isPersonalInfoValid && isShippingAddressValid && isBillingAddressValid);
  }, [isPersonalInfoValid, isShippingAddressValid, isBillingAddressValid]);


  // Handlers to update state from CheckoutForm components
  const handlePersonalInfoUpdate = (data: PersonalInfoData, isValid: boolean) => {
    setPersonalInfo(data);
    setIsPersonalInfoValid(isValid);
  };

  const handleShippingAddressUpdate = (data: AddressData, isValid: boolean) => {
    setShippingAddress(data);
    setIsShippingAddressValid(isValid);
  };

  const handleBillingAddressUpdate = (data: AddressData, isValid: boolean) => {
    setBillingAddress(data);
    setIsBillingAddressValid(isValid);
  };


  // State for checkout steps if doing multi-step, or just sections for single page
  // const [currentStep, setCurrentStep] = useState(1);
  // const [formData, setFormData] = useState({}); // State for form data

  if (loading) {
    return <div className="container mx-auto p-4">Loading cart for checkout...</div>;
  }

  if (cartError) {
    return <div className="container mx-auto p-4">Error loading cart: {cartError}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h2>Your Cart is Empty</h2>
        <p>Cannot proceed to checkout with an empty cart.</p>
        {/* Link back to products or cart */}
      </div>
    );
  }

  // Implement handlePlaceOrder function
  const handlePlaceOrder = async () => {
    if (!isOverallFormValid || isPlacingOrder) {
      return; // Prevent placing order if form is invalid or already submitting
    }

    setIsPlacingOrder(true);
    setPlaceOrderError(null);

    const orderData = {
      personalInfo,
      shippingAddress,
      billingAddress,
      // Include cart items or let backend fetch from user's active cart
      // Based on backend, it likely uses the authenticated user's active cart
    };

    try {
      const order = await orderService.createOrder(orderData); // Call backend API
      console.log('Order placed successfully:', order);

      await clearCart(); // Clear cart on successful order placement

      // Redirect to order confirmation page
      navigate(`/order-confirmation/${order._id}`); // Assuming backend returns order with _id

    } catch (err: any) {
      setPlaceOrderError(err.message || 'Failed to place order');
      console.error('Order placement error:', err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Optional: Progress Indicator */}
      {/* <ProgressIndicator currentStep={currentStep} totalSteps={3} /> */}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Checkout Form Area */}
        <div className="flex-grow lg:w-2/3">
          {/* Section: Personal Information */}
          <section className="mb-8 p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">1. Personal Information</h2>
            {/* Integrate Personal Info Form Component */}
            <CheckoutForm
              type="personal"
              initialData={personalInfo}
              onUpdate={handlePersonalInfoUpdate}
            />
          </section>

          {/* Section: Shipping Address */}
          <section className="mb-8 p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">2. Shipping Address</h2>
            {/* Integrate Shipping Address Form Component */}
            <CheckoutForm
              type="shipping"
              initialData={shippingAddress}
              onUpdate={handleShippingAddressUpdate}
            />
          </section>

          {/* Section: Billing Address */}
          <section className="mb-8 p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">3. Billing Address</h2>
            {/* Integrate Billing Address Form Component */}
             <CheckoutForm
              type="billing"
              initialData={billingAddress}
              onUpdate={handleBillingAddressUpdate}
            />
             {/* Option: Same as shipping */}
            {/* Example: <CheckoutForm type="billing" formData={formData} onUpdate={setFormData} /> */}
          </section>

          {/* Section: Order Review (Can also be in sidebar) */}
           <section className="mb-8 p-6 border rounded-lg shadow-sm lg:hidden"> {/* Hide on large screens if using sidebar */}
            <h2 className="text-xl font-semibold mb-4">4. Order Review</h2>
             {/* Placeholder for Order Summary Component */}
              {/* Example: <OrderSummary cart={cart} /> */}
              <p>Basic Order Summary Here (Mobile View)</p>
           </section>

            {/* Display place order error */}
            {placeOrderError && <div className="text-red-600 mt-4">Error: {placeOrderError}</div>}

          {/* Place Order Button */}
          <div className="mt-6 text-right">
            <button
              className={`bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold ${!isOverallFormValid || loading || isPlacingOrder ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
              onClick={handlePlaceOrder}
              disabled={!isOverallFormValid || loading || cart.items.length === 0 || isPlacingOrder}
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-1/3">
           <section className="p-6 border rounded-lg shadow-sm bg-gray-50">
             <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
             {/* Example: <OrderSummary cart={cart} /> */}
             {/* Basic Summary Display */}
             {cart.items.map(item => (
                <div key={item._id} className="flex justify-between py-1 border-b last:border-b-0 text-sm">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
             ))}
             <div className="mt-4 space-y-1">
                <div className="flex justify-between text-sm font-medium"><span>Subtotal:</span><span>${cart.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm font-medium"><span>Tax:</span><span>${cart.tax.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm font-medium"><span>Shipping:</span><span>${cart.shipping.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold mt-2"><span>Order Total:</span><span>${cart.total.toFixed(2)}</span></div>
             </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 