import { useEffect, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { spay } from '../../services/api/payments';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import showToast from '../ui/Toast';

export default function CheckoutForm({ handleClose, triggerPulse }) {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const clearQueryParams = () => {
    navigate(
      {
        pathname: location.pathname,
        search: '',
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');

    if (!clientSecret) {
      return;
    }

    const handlePaymentIntent = async () => {
      try {
        const resp = await stripe.retrievePaymentIntent(clientSecret);

        if (resp?.paymentIntent) {
          await spay({ charge: resp.paymentIntent, userUuid: persistedUserInfo.uuid });
          clearQueryParams();
          queryClient.invalidateQueries(['userInfo']);
          triggerPulse();

          switch (resp.paymentIntent.status) {
            case 'succeeded':
              showToast('success', 'paymentSuccessful');
              break;
            case 'processing':
              console.log('Your payment is processing');
              break;
            case 'requires_payment_method':
              showToast('warning', 'paymentUnsuccessful');

            default:
              showToast('error', 'somethingWrong');
              break;
          }
        } else {
          console.log('Something went wrong retrieving the payment intent.');
        }
      } catch (error) {
        showToast('error', 'error', {}, error.message);
      } finally {
        localStorage.removeItem('scs');
        localStorage.removeItem('paymentMethod');
        handleClose();
      }
    };

    handlePaymentIntent();
  }, [stripe]);

  // New effect to track form completion
  useEffect(() => {
    const checkFormComplete = (event) => {
      setIsFormComplete(event.complete);
    };

    const paymentElement = elements?.getElement(PaymentElement);
    paymentElement?.on('change', checkFormComplete);

    return () => {
      paymentElement?.off('change', checkFormComplete);
    };
  }, [elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${import.meta.env.VITE_FRONTEND_URL}/treasury/buy-fdx`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      showToast('error', 'error', {}, error.message);
    } else {
      showToast('error', 'unexpectedError');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[34px]">
        <Button variant={'submit'} disabled={!stripe || !elements || isLoading || !isFormComplete}>
          {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Pay now'}
        </Button>
      </div>
    </form>
  );
}
