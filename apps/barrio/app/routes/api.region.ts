import { zodResolver } from '@hookform/resolvers/zod';
import { getCartId, setSelectedRegionId } from '@libs/util/server/cookies.server';
import { updateCart } from '@libs/util/server/data/cart.server';
import { retrieveRegion } from '@libs/util/server/data/regions.server';
import { ActionFunctionArgs, data } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

export const changeRegionSchema = z.object({
  regionId: z.string().min(1, 'Region ID is required'),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const { errors, data: formData } = await getValidatedFormData(request, zodResolver(changeRegionSchema));

  if (errors) {
    return data({ errors }, { status: 400 });
  }

  try {
    const { regionId } = formData;

    await retrieveRegion(regionId);

    const headers = new Headers();

    await setSelectedRegionId(headers, regionId);

    const cartId = await getCartId(request.headers);

    if (cartId) await updateCart(request, { region_id: regionId });

    return data({ success: true }, { headers });
  } catch (error: any) {
    return data(error.response.data, {
      status: error.response.status,
    });
  }
};
