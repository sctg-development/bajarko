import { Alert } from '@app/components/common/alert/Alert';
import { useCheckout } from '@app/hooks/useCheckout';
import { useCustomer } from '@app/hooks/useCustomer';
import { FC, useEffect } from 'react';
import { CheckoutAccountDetails } from './CheckoutAccountDetails';
import { CheckoutDeliveryMethod } from './CheckoutDeliveryMethod';
import { CheckoutPayment } from './CheckoutPayment';
import { StripeExpressCheckout } from './StripePayment/StripeExpressPayment';

export const CheckoutFlow: FC = () => {
  const { customer } = useCustomer();
  const { goToNextStep, cart } = useCheckout();
  const isLoggedIn = !!customer?.id;

  if (!cart) return;

  useEffect(() => {
    if (isLoggedIn) goToNextStep();
    return () => goToNextStep();
  }, [isLoggedIn]);

  return (
    <>
      <div className="lg:min-h-[calc(100vh-320px)] lg:pl-8">
        {isLoggedIn && (
          <Alert type="info" className="mb-8">
            Checking out as:{' '}
            <strong className="font-bold">
              {customer.first_name} {customer.last_name} ({customer.email})
            </strong>
          </Alert>
        )}

        <StripeExpressCheckout cart={cart} />

        <CheckoutAccountDetails />

        <hr className="my-10" />

        <CheckoutDeliveryMethod />

        <CheckoutPayment />
      </div>
    </>
  );
};
