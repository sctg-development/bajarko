import { zodResolver } from '@hookform/resolvers/zod';
import { addressPayload, addressToMedusaAddress, medusaAddressToAddress } from '@libs/util/addresses';
import { removeCartId } from '@libs/util/server/cookies.server';
import { initiatePaymentSession, placeOrder, retrieveCart, updateCart } from '@libs/util/server/data/cart.server';
import type { StoreCart } from '@medusajs/types';
import type { ActionFunctionArgs } from 'react-router';
import { redirect, data as remixData } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  company: z.string().optional(),
  address1: z.string().min(1, 'Address is required').optional(),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required').optional(),
  province: z.string().min(1, 'Province is required').optional(),
  countryCode: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  phone: z.string().optional(),
});

export const completeCheckoutSchema = z
  .object({
    cartId: z.string(),
    providerId: z.string(),
    paymentMethodId: z.string(),
    sameAsShipping: z.boolean().optional(),
    billingAddress: z.any(),
    noRedirect: z.boolean().optional(),
  })
  .refine((data) => (data.sameAsShipping ? z.any() : addressSchema.safeParse(data.billingAddress).success), {
    message: 'Valid billing address is required when creating a new address',
    path: ['root'],
  });

export type CompleteCheckoutFormData = z.infer<typeof completeCheckoutSchema>;

export async function action(actionArgs: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<CompleteCheckoutFormData>(
    actionArgs.request,
    zodResolver(completeCheckoutSchema),
  );

  if (errors) {
    return remixData({ errors }, { status: 400 });
  }

  let cart = (await retrieveCart(actionArgs.request)) as StoreCart;

  const billingAddress = data.sameAsShipping ? cart.shipping_address : addressToMedusaAddress(data.billingAddress);

  cart = (
    await updateCart(actionArgs.request, {
      billing_address: addressPayload(billingAddress),
    })
  )?.cart;

  const activePaymentSession = cart.payment_collection?.payment_sessions?.find((ps) => ps.status === 'pending');

  if (activePaymentSession?.provider_id !== data.providerId || !cart.payment_collection?.payment_sessions?.length) {
    await initiatePaymentSession(actionArgs.request, cart, {
      provider_id: data.providerId,
      data: { payment_method: data.paymentMethodId },
    });
  }

  const isNewPaymentMethod = data.paymentMethodId === 'new';

  if (!isNewPaymentMethod && data.providerId === 'pp_stripe_stripe') {
    await initiatePaymentSession(actionArgs.request, cart, {
      provider_id: data.providerId,
      data: { payment_method: data.paymentMethodId },
    });
  }

  const cartResponse = await placeOrder(actionArgs.request);

  if (cartResponse.type === 'cart' || !cartResponse) {
    return remixData(
      { errors: { root: { message: 'Cart could not be completed. Please try again.' } } },
      { status: 400 },
    );
  }

  const headers = new Headers();
  await removeCartId(headers);

  const { order } = cartResponse;

  if (data.noRedirect) {
    return remixData({ order }, { headers });
  }

  throw redirect(`/checkout/success?order_id=${order.id}`, { headers });
}
