import { useCheckout } from '@app/hooks/useCheckout';
import { amountToStripeExpressCheckoutAmount } from '@libs/util/checkout/amountToStripeExpressCheckoutAmount';
import { StoreCart } from '@medusajs/types';
import { StripeElementsOptionsMode } from '@stripe/stripe-js';
import { type FC } from 'react';
import { StripeElementsProvider } from './StripeElementsProvider';
import { StripeExpressCheckoutForm } from './StripeExpressPaymentForm';

interface StripeExpressCheckoutProps {
  cart: StoreCart;
}

export const StripeExpressCheckout: FC<StripeExpressCheckoutProps> = ({ cart }) => {
  const { activePaymentSession } = useCheckout();

  const options: StripeElementsOptionsMode = {
    mode: 'payment',
    amount: amountToStripeExpressCheckoutAmount(cart.total),
    currency: cart?.currency_code || 'usd',
    capture_method: 'manual',
  };

  return (
    <StripeElementsProvider options={options}>
      <StripeExpressCheckoutForm />
    </StripeElementsProvider>
  );
};
