import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Stripe = ({ clientSecret, handleClose, triggerPulse }) => {
  const [localClientSecret, setLocalClientSecret] = useState(clientSecret || localStorage.getItem('scs'));

  useEffect(() => {
    if (!localClientSecret) {
      setLocalClientSecret(localStorage.getItem('scs'));
    }
  }, [localStorage.getItem('scs')]);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret: localClientSecret,
    appearance,
  };

  return (
    <>
      {(localClientSecret || localStorage.getItem('scs')) && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm handleClose={handleClose} triggerPulse={triggerPulse} />
        </Elements>
      )}
    </>
  );
};

export default Stripe;
