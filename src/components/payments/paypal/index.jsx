import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PaymentForm } from './PaymentForm';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const Paypal = ({ clientToken, dollar, handleClose, triggerPulse }) => {
  const initialOptions = {
    'client-id': clientId,
    'data-client-token': clientToken,
    components: 'hosted-fields,buttons',
    'enable-funding': 'paylater,venmo',
    'data-sdk-integration-source': 'integrationbuilder_ac',
  };

  return (
    <>
      {clientToken ? (
        <PayPalScriptProvider options={initialOptions}>
          <PaymentForm dollar={dollar} handleClose={handleClose} triggerPulse={triggerPulse} />
        </PayPalScriptProvider>
      ) : (
        <h4>WAITING ON CLIENT TOKEN</h4>
      )}
    </>
  );
};

export default Paypal;
