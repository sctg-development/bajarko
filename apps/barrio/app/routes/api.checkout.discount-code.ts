import { zodResolver } from '@hookform/resolvers/zod';
import { sdk } from '@libs/util/server/client.server';
import type { ActionFunctionArgs } from 'react-router';
import { data as remixData } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

export const discountCodeSchema = z.object({
  cartId: z.string(),
  code: z.string().min(1, 'Discount code is required'),
});

export type DiscountCodeFormData = z.infer<typeof discountCodeSchema>;

export async function action(actionArgs: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<DiscountCodeFormData>(
    actionArgs.request,
    zodResolver(discountCodeSchema),
  );

  if (errors) {
    return remixData({ errors }, { status: 400 });
  }

  try {
    const { cart } = await sdk.store.cart.update(data.cartId, {
      promo_codes: [data.code],
    });

    if (cart.promotions.length)
      if (!cart) {
        return remixData(
          { errors: { root: { message: 'Cart could not be updated. Please try again.' } } },
          { status: 400 },
        );
      }

    return remixData({ cart });
  } catch (error) {
    console.error(error);
    return remixData({ errors: { root: { message: 'Discount code is invalid.' } } }, { status: 400 });
  }
}
