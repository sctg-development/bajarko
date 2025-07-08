import { zodResolver } from '@hookform/resolvers/zod';
import { addressToMedusaAddress } from '@libs/util';
import { updateCart } from '@libs/util/server/data/cart.server';
import type { ActionFunctionArgs } from 'react-router';
import { data as remixData } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

export const accountDetailsSchema = z.object({
  cartId: z.string(),
  customerId: z.string().optional(),
  email: z.string().email('Please enter a valid email'),
  shippingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    address1: z.string().min(1, 'Address is required'),
    address2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    countryCode: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    phone: z.string().optional(),
  }),
  shippingAddressId: z.string(),
  isExpressCheckout: z.boolean().optional(),
});

export type AccountDetailsFormData = z.infer<typeof accountDetailsSchema>;

export async function action(actionArgs: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<AccountDetailsFormData>(
    actionArgs.request,
    zodResolver(accountDetailsSchema),
  );

  if (errors) {
    return remixData({ errors }, { status: 400 });
  }

  const formattedShippingAddress = addressToMedusaAddress(data.shippingAddress);

  const { cart } = await updateCart(actionArgs.request, {
    email: data.email,
    shipping_address: formattedShippingAddress,
    billing_address: formattedShippingAddress,
  });

  return remixData({ cart });
}
