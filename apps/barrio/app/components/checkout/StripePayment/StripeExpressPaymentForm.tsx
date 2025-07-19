import { Alert } from '@app/components/common/alert';
import { useCheckout } from '@app/hooks/useCheckout';
import { Address } from '@libs/types';
import { amountToStripeExpressCheckoutAmount } from '@libs/util/checkout/amountToStripeExpressCheckoutAmount';
import { expressCheckoutClient } from '@libs/util/checkout/express-checkout-client';
import { StoreCart, StoreCartShippingOption } from '@medusajs/types';
import { ExpressCheckoutElement, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  type ClickResolveDetails,
  type PaymentIntentResult,
  type ShippingRate,
  type StripeExpressCheckoutElementClickEvent,
  type StripeExpressCheckoutElementConfirmEvent,
  type StripeExpressCheckoutElementReadyEvent,
  type StripeExpressCheckoutElementShippingAddressChangeEvent,
  type StripeExpressCheckoutElementShippingRateChangeEvent,
} from '@stripe/stripe-js';
import { type FC, useState } from 'react';
import { useNavigate } from 'react-router';

const mapShippingRates = (shippingOptions: StoreCartShippingOption[]): ShippingRate[] => {
  if (!shippingOptions?.length) return [];

  return (
    shippingOptions
      .map((option, index) => ({
        id: option.id ?? index.toString(),
        displayName: option.name ?? `Shipping Option ${index + 1}`,
        amount: amountToStripeExpressCheckoutAmount(option.amount ?? 0),
      }))
      .sort((a, b) => a.amount - b.amount) ?? []
  );
};

const ExpressCheckoutSkeleton: FC = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
      <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
    </div>
  );
};

export const StripeExpressCheckoutForm: FC = () => {
  const navigate = useNavigate();
  const [stripeError, setStripeError] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const stripe = useStripe();
  const elements = useElements();
  const { cart: initialCart } = useCheckout();
  const [cart, setCart] = useState<StoreCart>(initialCart as StoreCart);

  const [canMakePaymentStatus, setCanMakePaymentStatus] = useState<'first_load' | 'available' | 'unavailable'>(
    'first_load',
  );
  const [selectedExpressPaymentType, setSelectedExpressPaymentType] = useState<string | null>(null);

  const { shippingOptions: initialShippingOptions, activePaymentSession, paymentProviders } = useCheckout();

  const isStripeAvailable = paymentProviders.some((provider) => provider.id === 'pp_stripe_stripe');

  if (!cart || !isStripeAvailable) return null;
  if (canMakePaymentStatus === 'unavailable') return null;

  const onCancel = async () => {
    location.reload();
    setSelectedExpressPaymentType(null);
  };

  const onReady = ({ availablePaymentMethods, ...rest }: StripeExpressCheckoutElementReadyEvent) => {
    if (!availablePaymentMethods) {
      setCanMakePaymentStatus('unavailable');
      return;
    }

    setCanMakePaymentStatus('available');
  };

  const onClick = ({ resolve, expressPaymentType }: StripeExpressCheckoutElementClickEvent) => {
    setSelectedExpressPaymentType(expressPaymentType);
    const options: ClickResolveDetails = {
      emailRequired: true,
      shippingAddressRequired: true, // required to collect shipping address
      billingAddressRequired: true,
      phoneNumberRequired: true,
      shippingRates: mapShippingRates(initialShippingOptions),
    };

    resolve(options);
  };

  const onConfirm = async (ev: StripeExpressCheckoutElementConfirmEvent) => {
    try {
      if (!stripe || !elements) {
        ev.paymentFailed({ reason: 'fail' });
        return;
      }

      const payerNameSplit = (ev.billingDetails?.name ?? ev.shippingAddress?.name)?.split(' ');

      if (!payerNameSplit) {
        console.error('No name provided');

        setStripeError({
          title: 'No name provided',
          description: 'Please provide a valid name.',
        });

        ev.paymentFailed({
          reason: 'fail',
        });
        return;
      }

      const shippingAddress: Address = {
        firstName: payerNameSplit[0] ?? '',
        lastName: payerNameSplit[1] ?? '',
        address1: ev.shippingAddress?.address.line1 ?? '',
        address2: ev.shippingAddress?.address.line2 ?? '',
        city: ev.shippingAddress?.address.city ?? '',
        province: ev.shippingAddress?.address.state ?? '',
        postalCode: ev.shippingAddress?.address.postal_code ?? '',
        countryCode: ev.shippingAddress?.address.country.toLowerCase() ?? '',
        phone: ev.billingDetails?.phone ?? '',
      };

      const billingAddress: Address = {
        firstName: payerNameSplit[0] ?? '',
        lastName: payerNameSplit[1] ?? '',
        address1: ev.billingDetails?.address?.line1 ?? '',
        address2: ev.billingDetails?.address?.line2 ?? '',
        city: ev.billingDetails?.address?.city ?? '',
        province: ev.billingDetails?.address?.state ?? '',
        postalCode: ev.billingDetails?.address?.postal_code ?? '',
        countryCode: ev.billingDetails?.address?.country?.toLowerCase() ?? '',
        phone: ev.billingDetails?.phone ?? '',
        company: ev.billingDetails?.name ?? '',
      };

      const [updatedCartRes, updateError] = await expressCheckoutClient.update({
        cartId: cart.id,
        email: ev.billingDetails?.email ?? cart.email,
        shippingAddress,
        billingAddress,
        complete: false,
      });

      if (updateError) {
        setStripeError({
          title: 'Error updating account details',
          description: updateError.message,
        });

        ev.paymentFailed({
          reason: 'fail',
        });

        return;
      }

      const updatedCart = updatedCartRes.cart;

      const updatedPaymentSession = updatedCart.payment_collection?.payment_sessions?.find(
        ({ provider_id, status }) => provider_id === 'pp_stripe_stripe' && status === 'pending',
      );
      const updatedClientSecret = updatedPaymentSession?.data.client_secret as string;

      if (!updatedClientSecret) throw new Error('No client secret provided in express checkout');

      const paymentResult = await stripe.confirmPayment({
        elements,
        clientSecret: updatedClientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: ev.billingDetails,
          },
        },
        redirect: 'if_required',
      });

      const { error } = paymentResult;

      if (error) {
        console.error(error);
        setStripeError({
          title: 'Payment failed',
          description: error.message ?? 'Error trying to confirm payment.',
        });

        ev.paymentFailed({
          reason: 'fail',
        });

        return;
      }

      const intent = (paymentResult as PaymentIntentResult).paymentIntent;

      if (!intent) {
        throw new Error('Error trying to confirm payment.');
      }

      if (intent.status === 'requires_action') {
        const { error } = await stripe.confirmCardPayment(updatedClientSecret);

        if (error) {
          console.error(error);

          setStripeError({
            title: 'Payment failed',
            description: error.message ?? 'Please provide a new payment method.',
          });

          ev.paymentFailed({
            reason: 'fail',
          });

          return;
        }
      }

      const [checkoutRes, checkoutError] = await expressCheckoutClient.update({
        cartId: updatedCart.id,
        complete: true,
      });

      if (checkoutError) {
        console.error(checkoutError);
        throw new Error('Error trying to complete checkout.');
      }

      const { order } = checkoutRes;

      if (!order) throw new Error('Error trying to complete checkout.');

      navigate(`/checkout/success?order_id=${order.id}`);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Error trying to submit payment.';

      setStripeError({
        title: 'Payment failed',
        description: errorMessage,
      });

      ev.paymentFailed({
        reason: 'fail',
      });
    }
  };

  const onShippingAddressChange = async (ev: StripeExpressCheckoutElementShippingAddressChangeEvent) => {
    // missing fields will be update on onConfirm event/handler
    const medusaAddress: Address = {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: ev.address?.city ?? '',
      province: ev.address?.state ?? '',
      postalCode: ev.address.postal_code ?? '',
      countryCode: ev.address?.country.toLowerCase() ?? '',
      phone: '',
      company: '',
    };

    const [updateAddressData, error] = await expressCheckoutClient.update({
      cartId: cart.id,
      email: cart.email ?? undefined,
      shippingAddress: medusaAddress,
    });

    if (error) {
      setStripeError({
        title: 'Error updating shipping address',
        description: error.message,
      });
      return ev.reject();
    }

    const { cart: updatedCart, shippingOptions: updatedShippingOptions } = updateAddressData;

    setCart(updatedCart);

    const updatedRates = mapShippingRates(updatedShippingOptions);

    if (!updatedRates.length) {
      setStripeError({
        title: 'No shipping methods available',
        description: 'Please provide a valid shipping address.',
      });

      return ev.reject();
    }

    let cartWithUpdatedShippingRate: StoreCart | null = updatedCart;

    const firstUpdatedRateId = updatedRates[0].id;
    const cartSelectedShippingOptionId = updatedCart.shipping_methods?.[0]?.shipping_option_id;
    const cartSelectedShippingRateId =
      cartSelectedShippingOptionId &&
      updatedCart.shipping_methods?.find(
        ({ shipping_option_id }) => cartSelectedShippingOptionId === shipping_option_id,
      )?.shipping_option_id;

    const selectedShippingRateId =
      selectedExpressPaymentType === 'apple_pay'
        ? (cartSelectedShippingRateId ?? firstUpdatedRateId)
        : firstUpdatedRateId;

    cartWithUpdatedShippingRate = await updateShippingRate(selectedShippingRateId);

    if (!cartWithUpdatedShippingRate) return ev.reject();

    setCart(cartWithUpdatedShippingRate);

    elements?.update({
      amount: amountToStripeExpressCheckoutAmount(cartWithUpdatedShippingRate.total),
    });

    const resolveDetails: ClickResolveDetails = { shippingRates: updatedRates };

    return ev.resolve(resolveDetails);
  };

  const onShippingRateChange = async (ev: StripeExpressCheckoutElementShippingRateChangeEvent) => {
    const updatedCart = await updateShippingRate(ev.shippingRate.id);

    if (!updatedCart) return ev.reject();

    elements?.update({
      amount: amountToStripeExpressCheckoutAmount(updatedCart.total),
    });

    ev.resolve();

    setCart(updatedCart);
  };

  const updateShippingRate = async (shippingRateId: string) => {
    const [updateShippingRateData, error] = await expressCheckoutClient.update({
      cartId: cart.id,
      shippingOptions: [shippingRateId],
    });

    if (error) {
      setStripeError({
        title: 'Error updating shipping rate',
        description: error.message,
      });
      return null;
    }

    const { cart: updatedCart } = updateShippingRateData;

    return updatedCart;
  };

  return (
    <>
      {(canMakePaymentStatus === 'available' || canMakePaymentStatus === 'first_load') && (
        <>
          <h2 className="text-2xl font-bold text-gray-900">Express Checkout</h2>

          {stripeError ? (
            <Alert type="error" title={stripeError.title} className="mt-4">
              {stripeError.description}
            </Alert>
          ) : null}
        </>
      )}

      <div className="py-4">
        {canMakePaymentStatus === 'first_load' && <ExpressCheckoutSkeleton />}

        <ExpressCheckoutElement
          options={{
            paymentMethodOrder: ['apple_pay', 'google_pay', 'link', 'card'],
            paymentMethods: {
              applePay: 'always',
              googlePay: 'always',
              link: 'auto',
            },
          }}
          onCancel={onCancel}
          onReady={onReady}
          onShippingAddressChange={onShippingAddressChange}
          onClick={onClick}
          onConfirm={onConfirm}
          onShippingRateChange={onShippingRateChange}
        />
      </div>

      {(canMakePaymentStatus === 'available' || canMakePaymentStatus === 'first_load') && (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 py-4">
          <hr className="w-full border-gray-300" />
          <div className="flex items-center justify-center pb-1 text-gray-500">or</div>
          <hr className="w-full border-gray-300" />
        </div>
      )}
    </>
  );
};
