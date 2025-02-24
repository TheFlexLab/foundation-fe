import { useState, useRef } from 'react';
import { Button } from '../../ui/Button';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { paypalPay } from '../../../services/api/payments';
import { PayPalHostedFieldsProvider, PayPalHostedField, usePayPalHostedFields } from '@paypal/react-paypal-js';
import { FaSpinner } from 'react-icons/fa6';
import showToast from '../../ui/Toast';
import { toast } from 'sonner';

export const url = import.meta.env.VITE_API_URL;

export const PaymentForm = ({ dollar, handleClose, triggerPulse }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function createOrderCallback() {
    try {
      const response = await fetch(`${url}/finance/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: dollar * 1,
        }),
      });

      const orderData = await response.json();

      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      return `Could not initiate PayPal Checkout...${error}`;
    }
  }

  async function onApproveCallback(data, actions) {
    try {
      const response = await fetch(`${url}/finance/${data.data.orderID}/captureOrderCall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const orderData = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
      const errorDetail = orderData?.details?.[0];
      // this actions.restart() behavior only applies to the Buttons component
      if (errorDetail?.issue === 'INSTRUMENT_DECLINED' && !data.data.card && actions) {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart();
      } else if (errorDetail || !transaction || transaction.status === 'DECLINED') {
        // (2) Other non-recoverable errors -> Show a failure message
        let errorMessage;
        if (transaction) {
          errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
        } else if (errorDetail) {
          errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
        } else {
          errorMessage = JSON.stringify(orderData);
        }

        throw new Error(errorMessage);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        // console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        await paypalPay({ charge: orderData, userUuid: data.uuid });
        if (transaction.status === 'COMPLETED') {
          showToast('success', 'paymentSuccessful');
          triggerPulse();
          queryClient.invalidateQueries(['userInfo']);
          localStorage.removeItem('paymentMethod');
          handleClose();
        } else {
          showToast('warning', 'paymentUnsuccessful');
        }
        return `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`;
      }
    } catch (error) {
      return `Sorry, your transaction could not be processed...${error}`;
    } finally {
      setIsLoading(false);
    }
  }

  const SubmitPayment = ({ onHandleMessage }) => {
    // Here declare the variable containing the hostedField instance
    const { cardFields } = usePayPalHostedFields();
    const cardHolderName = useRef(null);
    const persistedUserInfo = useSelector((state) => state.auth.user);

    const submitHandler = () => {
      setIsLoading(true);
      if (typeof cardFields.submit !== 'function') return; // validate that \`submit()\` exists before using it
      //if (errorMsg) showErrorMsg(false);
      cardFields
        .submit({
          // The full name as shown in the card and billing addresss
          // These fields are optional for Sandbox but mandatory for production integration
          cardholderName: cardHolderName?.current?.value,
        })
        .then(async (data) => onHandleMessage(await onApproveCallback({ data, uuid: persistedUserInfo.uuid })))
        .catch((orderData) => {
          console.log(orderData);
          onHandleMessage(`Sorry, your transaction could not be processed...${JSON.stringify(orderData)}`);
          toast.error(`Invalid or test card details entered. Please try again.`);
          setIsLoading(false);
        });
    };

    return (
      <div className="mt-[10px] flex w-full justify-end tablet:mt-5">
        <Button variant={'submit'} onClick={submitHandler} disabled={isLoading}>
          {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Pay'}
        </Button>
      </div>
    );
  };

  return (
    <div>
      <PayPalHostedFieldsProvider createOrder={createOrderCallback}>
        <div>
          <PayPalHostedField
            id="card-number"
            hostedFieldType="number"
            options={{
              selector: '#card-number',
              placeholder: 'Card Number',
            }}
            className="h-[60px] w-full rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
          />
          <div className="my-2 flex justify-between gap-2">
            <PayPalHostedField
              id="expiration-date"
              hostedFieldType="expirationDate"
              options={{
                selector: '#expiration-date',
                placeholder: 'Expiration Date',
              }}
              className="h-[60px] w-full rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
            />
            <PayPalHostedField
              id="cvv"
              hostedFieldType="cvv"
              options={{
                selector: '#cvv',
                placeholder: 'CVV',
              }}
              className="h-[60px] w-full rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
            />
          </div>
          {/* <div className="my-2 flex justify-between gap-2">
            <input
              id="card-holder"
              type="text"
              placeholder="Name on Card"
              className="h-[60px] w-full rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
            />

            <input
              id="card-billing-address-country"
              type="text"
              placeholder="Country Code"
              className="h-[60px] w-full rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
            />
          </div> */}
          <SubmitPayment onHandleMessage={setMessage} />
        </div>
      </PayPalHostedFieldsProvider>
    </div>
  );
};
