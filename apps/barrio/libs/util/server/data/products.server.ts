import { sdk } from '@libs/util/server/client.server';
import { HttpTypes } from '@medusajs/types';
import { retrieveRegion } from './regions.server';

export const getProductsById = ({
  ids,
  regionId,
}: {
  ids: string[];
  regionId: string;
}) => {
  return sdk.store.product
    .list({
      id: ids,
      region_id: regionId,
      fields: '*variants.calculated_price,+variants.inventory_quantity',
    })
    .then(({ products }: { products: HttpTypes.StoreProduct[] }) => products);
};

export const getProductByHandle = async (handle: string, regionId: string) => {
  return sdk.store.product
    .list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price,+variants.inventory_quantity',
    })
    .then(({ products }: { products: HttpTypes.StoreProduct[] }) => products[0]);
};

export const getProductsList = async ({
  pageParam = 1,
  queryParams,
  regionId,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  regionId: string;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  const limit = queryParams?.limit || 12;
  const offset = (pageParam - 1) * limit;
  const region = await retrieveRegion(regionId);

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    };
  }

  return sdk.store.product
    .list({
      limit,
      offset,
      region_id: region.id,
      fields: '*variants.calculated_price,+variants.inventory_quantity',
      ...queryParams,
    })
    .then(({ products, count }: { products: HttpTypes.StoreProduct[]; count: number }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null;

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      };
    });
};
