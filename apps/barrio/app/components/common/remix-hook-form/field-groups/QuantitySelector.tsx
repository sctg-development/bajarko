import { StoreProductVariant } from '@medusajs/types';
import clsx from 'clsx';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { useRemixFormContext } from 'remix-hook-form';

interface QuantitySelectorProps {
  variant: StoreProductVariant | undefined;
  maxInventory?: number;
  className?: string;
  formId?: string;
  onChange?: (quantity: number) => void;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({ className, variant, maxInventory = 10, onChange }) => {
  const formContext = useRemixFormContext();

  if (!formContext) {
    console.error('QuantitySelector must be used within a RemixFormProvider');
    return null;
  }

  const { control } = formContext;

  const variantInventory =
    variant?.manage_inventory && !variant.allow_backorder ? variant.inventory_quantity || 0 : maxInventory;

  const optionsArray = [...Array(Math.min(variantInventory, maxInventory))].map((_, index) => ({
    label: `${index + 1}`,
    value: index + 1,
  }));

  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field }) => (
        <div className={clsx('w-28 flex-grow-0', className)}>
          <label htmlFor="quantity" className="sr-only">
            Quantity
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Qty</span>
            <select
              {...field}
              className="focus:border-primary-500 focus:ring-primary-500 !h-12 !w-full rounded-md border-gray-300 pl-12 pr-4"
              value={field.value || '1'}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                field.onChange(value);
                onChange?.(value);
              }}
            >
              {optionsArray.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    />
  );
};
