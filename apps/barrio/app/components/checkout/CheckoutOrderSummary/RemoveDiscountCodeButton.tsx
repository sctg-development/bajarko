import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import { StoreCart, StoreCartPromotion } from '@medusajs/types';
import { FC } from 'react';
import { useFetcher } from 'react-router';

export interface RemoveDiscountCodeButtonProps {
  cart: StoreCart;
  promotion: StoreCartPromotion;
}

export const RemovePromotionCodeButton: FC<RemoveDiscountCodeButtonProps> = ({ cart, promotion }) => {
  const fetcher = useFetcher<{}>({ key: FetcherKeys.cart.removePromotionCode });

  if (['submitting', 'loading'].includes(fetcher.state)) return null;

  return (
    <fetcher.Form method="post" action="/api/checkout/remove-discount-code">
      <input type="hidden" name="cartId" value={cart.id} />
      <input type="hidden" name="code" value={promotion.code} />

      <button className="focus:ring-primary-100 focus:border-primary-100 inline-flex h-8 items-center rounded-md border border-gray-300 bg-white px-2 text-xs font-bold text-gray-900 shadow-sm hover:bg-gray-100">
        <span>{promotion.code}</span>
        <div className="ml-[4px] inline-block text-gray-400">
          <XMarkIcon className="inline-block h-4 w-4 leading-none" />
        </div>
      </button>
    </fetcher.Form>
  );
};
