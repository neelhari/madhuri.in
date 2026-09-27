/**
 * Razorpay Payment Gateway Client Helper
 */

export const RAZORPAY_KEY_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RAZORPAY_KEY_ID) ||
  'rzp_test_TgyBG4fu4dG84S';

/**
 * Loads the Razorpay checkout script dynamically.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Opens Razorpay standard checkout popup.
 */
export const openRazorpayPayment = async ({
  amount,
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  notes = {},
  onSuccess,
  onFailure
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    if (onFailure) {
      onFailure(new Error('Razorpay SDK failed to load. Please check your internet connection.'));
    }
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(Number(amount) * 100), // in paise
    currency: 'INR',
    name: 'MadhurFresh',
    description: `Order ${orderId || 'Checkout'} • Fresh Meat & Seafood`,
    image: '/image.png',
    prefill: {
      name: customerName || '',
      contact: customerPhone ? customerPhone.replace(/[^0-9]/g, '').slice(-10) : '',
      email: customerEmail || 'care@madurfresh.in'
    },
    notes: {
      store: 'MadhurFresh',
      orderId: orderId || '',
      ...notes
    },
    theme: {
      color: '#075437'
    },
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (onFailure) {
          onFailure(new Error('Payment window closed by customer'));
        }
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      if (onFailure) {
        onFailure(new Error(response.error?.description || 'Payment transaction failed'));
      }
    });
    rzp.open();
  } catch (err) {
    console.error('Razorpay initialization error:', err);
    if (onFailure) {
      onFailure(err);
    }
  }
};
