import React from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

const PayPalButton = ({amount, onSuccess, onError}) => {
  return <PayPalScriptProvider options={{"client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  }}>
  <PayPalButtons style={{ layout: "vertical" }}
    createOrder={(data, actions) => {
      return actions.order.create({
        purchase_units: [{ amount: { value: parseFloat(amount).toFixed(2) } }],
      });
    }}
    onApprove={(data, actions) => {
      return actions.order.capturef().then(onSuccess);
    }}
    onError={onError}
  />
  </PayPalScriptProvider >
}

export default PayPalButton
