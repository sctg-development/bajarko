import { zodResolver } from '@hookform/resolvers/zod';
import { sdk } from '@libs/util/server/client.server';
import { retrieveCart } from '@libs/util/server/data/cart.server';
import type { PromotionDTO } from '@medusajs/types';
import type { ActionFunctionArgs } from 'react-router';
import { data as remixData } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

export const removeDiscountCodeSchema = z.object({
  cartId: z.string(),
  code: z.string().min(1, 'Discount code is required'),
});

export type RemoveDiscountCodeFormData = z.infer<typeof removeDiscountCodeSchema>;

export async function action(actionArgs: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<RemoveDiscountCodeFormData>(
    actionArgs.request,
    zodResolver(removeDiscountCodeSchema),
  );

  if (errors) {
    return remixData({ errors }, { status: 400 });
  }

  const cart = await retrieveCart(actionArgs.request);
  const promoCodes = (cart as any)?.promotions
    ?.filter((promo: PromotionDTO) => promo.code !== data.code)
    .map((promo: PromotionDTO) => promo.code) as string[];

  const { cart: updatedCart } = await sdk.store.cart.update(data.cartId, {
    promo_codes: promoCodes || [],
  });

  if (!updatedCart) {
    return remixData({ errors: { root: { message: 'Could not remove promo code.' } } }, { status: 400 });
  }

  return remixData({ cart: updatedCart });
}
