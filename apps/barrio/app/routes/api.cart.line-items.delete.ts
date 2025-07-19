import { zodResolver } from '@hookform/resolvers/zod';
import { deleteLineItem, retrieveCart } from '@libs/util/server/data/cart.server';
import { StoreCart } from '@medusajs/types';
import { type ActionFunctionArgs, data } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

const deleteLineItemSchema = z.object({
  lineItemId: z.string().min(1, 'Line item ID is required'),
});

type DeleteLineItemFormData = z.infer<typeof deleteLineItemSchema>;

export async function action({ request }: ActionFunctionArgs) {
  const { errors, data: validatedFormData } = await getValidatedFormData<DeleteLineItemFormData>(
    request,
    zodResolver(deleteLineItemSchema),
  );

  if (errors) {
    return data({ errors }, { status: 400 });
  }

  const { lineItemId } = validatedFormData;

  await deleteLineItem(request, lineItemId);
  const cart = (await retrieveCart(request)) as StoreCart;

  return data({ cart });
}
