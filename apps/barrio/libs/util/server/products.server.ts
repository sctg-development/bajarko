import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { HttpTypes } from '@medusajs/types';
import { MILLIS } from './cache-builder.server';
import { getSelectedRegion } from './data/regions.server';

export const fetchProducts = async (request: Request, { ...query }: HttpTypes.StoreProductListParams = {}) => {
  const region = await getSelectedRegion(request.headers);

  return await cachified({
    key: `products-${JSON.stringify(query)}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return await sdk.store.product.list({
        ...query,
        region_id: region.id,
      });
    },
  });
};
