import { ButtonLink } from '@app/components/common/buttons/ButtonLink';
import { SubmitButton } from '@app/components/common/remix-hook-form/buttons/SubmitButton';
import { FormError } from '@app/components/common/remix-hook-form/forms/FormError';
import { StyledTextField } from '@app/components/common/remix-hook-form/forms/fields/StyledTextField';
import { discountCodeSchema } from '@app/routes/api.checkout.discount-code';
import { zodResolver } from '@hookform/resolvers/zod';
import { HttpTypes, PromotionDTO } from '@medusajs/types';
import { FC, useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { RemovePromotionCodeButton } from './RemoveDiscountCodeButton';

export interface CheckoutOrderSummaryDiscountCodeProps {
  cart: HttpTypes.StoreCart & { promotions: PromotionDTO[] };
}

export const CheckoutOrderSummaryDiscountCode: FC<CheckoutOrderSummaryDiscountCodeProps> = ({ cart }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<{
    errors?: { [key: string]: string };
  }>();
  const [isFormVisible, setIsFormVisible] = useState<boolean>(!!(cart.promotions as PromotionDTO[]).length);
  const hasDiscounts = !!cart.promotions?.length;
  const hasErrors = Object.keys(fetcher.data?.errors || {}).length > 0;
  const isSubmitting = ['submitting', 'loading'].includes(fetcher.state);

  const form = useRemixForm({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      cartId: cart.id,
      code: '',
    },

    fetcher,
    submitConfig: {
      method: 'post',
      action: '/api/checkout/discount-code',
    },
  });

  useEffect(() => {
    if (!isSubmitting && !hasErrors) {
      form.reset();
      inputRef.current?.focus();
    }
  }, [isSubmitting, hasErrors]);

  const handleAddCodeClick = () => {
    setIsFormVisible(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="mb-6">
      {!isFormVisible && (
        <div>
          <ButtonLink size="sm" onClick={handleAddCodeClick}>
            Add promo code
          </ButtonLink>
        </div>
      )}

      {isFormVisible && (
        <>
          <RemixFormProvider {...form}>
            <fetcher.Form ref={formRef} onSubmit={form.handleSubmit}>
              <input type="hidden" name="cartId" value={cart.id} />
              <div className="!my-0 !flex items-start gap-1">
                <StyledTextField
                  name="code"
                  className="flex-grow"
                  placeholder="Discount code"
                  aria-label="discount code"
                />
                <SubmitButton type="submit" className="flex-shrink-0 flex-grow-0" disabled={isSubmitting}>
                  {isSubmitting ? 'Applying...' : 'Apply'}
                </SubmitButton>
              </div>
              <FormError />
            </fetcher.Form>
          </RemixFormProvider>

          {hasDiscounts && (
            <div className="mt-2">
              {cart.promotions?.map((promotion) => (
                <RemovePromotionCodeButton key={promotion.id} cart={cart} promotion={promotion} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
