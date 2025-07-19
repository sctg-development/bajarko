import { useCheckout } from '@app/hooks/useCheckout';
import { CheckoutStep } from '@app/providers/checkout-provider';
import clsx from 'clsx';
import { FC } from 'react';
import { CheckoutOrderSummary } from './CheckoutOrderSummary';

export const CheckoutSidebar: FC = () => {
  const { step } = useCheckout();

  return (
    <div
      className={clsx('h-full', {
        'hidden lg:block': step === CheckoutStep.PAYMENT,
      })}
    >
      <div className="sticky top-24">
        <CheckoutOrderSummary name="sidebar" />
      </div>
    </div>
  );
};
