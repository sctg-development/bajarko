import { sdk } from '@libs/util/server/client.server';
import { StorePaymentProvider } from '@medusajs/types';

export const listCartPaymentProviders = async (regionId: string) => {
  return sdk.store.payment
    .listPaymentProviders({ region_id: regionId }, {
      seller_id: BARRIO_SELLER_ID,
    })
    .then(({ payment_providers }) => payment_providers)
    .catch(() => [] as StorePaymentProvider[]);
};
