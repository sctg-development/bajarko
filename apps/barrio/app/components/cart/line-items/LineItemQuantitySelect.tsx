import { QuantitySelector } from '@app/components/common/remix-hook-form/field-groups/QuantitySelector';
import { updateLineItemSchema } from '@app/routes/api.cart.line-items.update';
import { zodResolver } from '@hookform/resolvers/zod';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import { StoreCartLineItem } from '@medusajs/types';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';

export interface LineItemQuantitySelectProps extends HTMLAttributes<HTMLFormElement> {
  formId: string;
  item: StoreCartLineItem;
  maxInventory?: number;
}

export const LineItemQuantitySelect: FC<LineItemQuantitySelectProps> = ({
  formId,
  item,
  className,
  maxInventory = 10,
  ...props
}) => {
  const fetcher = useFetcher({ key: FetcherKeys.cart.updateLineItem });

  const isLoading = ['submitting', 'loading'].includes(fetcher.state);

  const form = useRemixForm({
    resolver: zodResolver(updateLineItemSchema),
    defaultValues: {
      lineItemId: item.id,
      quantity: item.quantity.toString(),
    },
    fetcher,
    submitConfig: {
      method: 'post',
      action: '/api/cart/line-items/update',
    },
  });

  const handleChange = (quantity: number) => {
    fetcher.submit(
      {
        lineItemId: item.id,
        quantity: quantity,
      },
      { method: 'post', action: '/api/cart/line-items/update' },
    );
  };

  return (
    <RemixFormProvider {...form}>
      <fetcher.Form
        id={formId}
        className={clsx('line-item-quantity-select', className)}
        {...props}
        onSubmit={form.handleSubmit}
      >
        <QuantitySelector
          formId={formId}
          className={clsx({
            'pointer-events-none opacity-50': isLoading,
          })}
          variant={item.variant as any}
          onChange={handleChange}
        />
      </fetcher.Form>
    </RemixFormProvider>
  );
};
