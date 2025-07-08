import { FetcherKeys } from '@libs/util/fetcher-keys';
import { StoreCart, StoreCartLineItem } from '@medusajs/types';
import { useFetcher } from 'react-router';

export const useRemoveCartItem = () => {
  const fetcher = useFetcher<{ cart: StoreCart }>({ key: FetcherKeys.cart.removeLineItem });

  const submit = ({ id: lineItemId }: StoreCartLineItem) => {
    fetcher.submit({ lineItemId }, { method: 'delete', action: '/api/cart/line-items/delete' });
  };

  return { fetcher, state: fetcher.state, submit };
};
