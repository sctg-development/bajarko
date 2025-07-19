import { zodResolver } from '@hookform/resolvers/zod';
import { addressToMedusaAddress } from '@libs/util/addresses';
import { updateCart } from '@libs/util/server/data/cart.server';
import type { ActionFunctionArgs } from 'react-router';
import { data as remixData } from 'react-router';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';

export const billingAddressSchema = z.object({
  cartId: z.string(),
  billingAddress: z.object({
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
});

export type BillingAddressFormData = z.infer<typeof billingAddressSchema>;

export async function action(actionArgs: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<BillingAddressFormData>(
    actionArgs.request,
    zodResolver(billingAddressSchema),
  );

  if (errors) {
    return remixData({ errors }, { status: 400 });
  }

  const billingAddress = addressToMedusaAddress(data.billingAddress);

  const { cart } = await updateCart(actionArgs.request, {
    billing_address: billingAddress,
  });

  return remixData({ cart });
}

export function useBillingAddressForm() {
  return useRemixForm<BillingAddressFormData>({
    resolver: zodResolver(billingAddressSchema),
  });
}
