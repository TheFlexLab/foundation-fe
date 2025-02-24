import axios from 'axios';
import PopUp from '../ui/PopUp';
import Stripe from '../payments/Stripe';
import Paypal from '../payments/paypal';
import { useEffect, useState } from 'react';
import { paypalTokenGenerate } from '../../services/api/payments';
import { FaSpinner } from 'react-icons/fa6';

const BASE_URL = import.meta.env.VITE_API_URL;

export default function BuyBalancePopup({ handleClose, modalVisible, title, image, dollar, triggerPulse }) {
  const [paymentMethod, setPaymentMethod] = useState(null || localStorage.getItem('paymentMethod'));
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [clientToken, setClientToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      setIsLoading(true);
      try {
        if (paymentMethod === 'stripe' && dollar >= 0.5) {
          const response = await axios.post(`${BASE_URL}/finance/getStripePaymentIntent`, {
            amount: dollar,
            currency: 'usd',
          });
          localStorage.setItem('scs', response.data.clientSecret);
          setStripeClientSecret(response.data.clientSecret);
        }
        if (paymentMethod === 'paypal' && dollar >= 0.5) {
          const token = await paypalTokenGenerate();
          setClientToken(token);
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [paymentMethod]);

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose} isBackground={true} autoSize={true}>
      <div className="flex flex-col gap-2 px-[18px] py-[10px] tablet:gap-[15px] tablet:px-[55px] tablet:py-[25px]">
        <div className="flex items-center gap-[10px] tablet:gap-5">
          <button
            className={`flex w-full flex-col gap-1 rounded-[8px] border-[2.64px] px-4 py-3 tablet:py-7 ${paymentMethod === 'stripe' ? 'border-[#4A8DBD]' : 'border-[#E0E0E0]'}`}
            onClick={() => {
              localStorage.setItem('paymentMethod', 'stripe');
              setPaymentMethod('stripe');
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/Stripe.svg`}
              alt="Stripe"
              className="h-5 w-12 tablet:h-6 tablet:w-[60px]"
            />
            <h1 className="text-[10px] font-semibold leading-[12px] text-[#727F96] tablet:text-[18px] tablet:leading-[18px]">
              Stripe
            </h1>
          </button>
          <button
            className={`flex w-full flex-col gap-1 rounded-[8px] border-[2.64px] px-4 py-3 tablet:py-7 ${paymentMethod === 'paypal' ? 'border-[#4A8DBD]' : 'border-[#E0E0E0]'}`}
            onClick={() => {
              localStorage.setItem('paymentMethod', 'paypal');
              setPaymentMethod('paypal');
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/PayPal2.svg`}
              alt="Stripe"
              className="h-[15px] w-[70px] tablet:h-[24px] tablet:w-[112px]"
            />
            <h1 className="text-[10px] font-semibold leading-[12px] text-[#727F96] tablet:text-[18px] tablet:leading-[18px]">
              Paypal
            </h1>
          </button>
        </div>
        {isLoading ? (
          <div className="my-4 flex w-full justify-center">
            <FaSpinner className="size-14 animate-spin text-[#4A8DBD]" />
          </div>
        ) : paymentMethod === 'stripe' ? (
          <Stripe clientSecret={stripeClientSecret} handleClose={handleClose} triggerPulse={triggerPulse} />
        ) : (
          paymentMethod === 'paypal' && (
            <Paypal clientToken={clientToken} dollar={dollar} handleClose={handleClose} triggerPulse={triggerPulse} />
          )
        )}
      </div>
    </PopUp>
  );
}
