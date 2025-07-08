import { formatPrice, getVariantFinalPrice, sortProductVariantsByPrice } from '@libs/util/prices';
import { StoreProduct } from '@medusajs/types';
import { type FC, useMemo } from 'react';
import { ProductVariantPrice } from './ProductVariantPrice';

export interface ProductPriceRangeProps {
  product: StoreProduct;
  currencyCode: string;
}

export const ProductPriceRange: FC<ProductPriceRangeProps> = ({ product, currencyCode }) => {
  const sortedVariants = useMemo(() => sortProductVariantsByPrice(product), [product, currencyCode]);

  const minVariant = sortedVariants[0];
  const maxVariant = sortedVariants[sortedVariants.length - 1];

  const minPrice = useMemo(() => getVariantFinalPrice(minVariant), [sortedVariants]);
  const maxPrice = useMemo(() => getVariantFinalPrice(maxVariant), [sortedVariants]);

  const hasPriceRange = minPrice !== maxPrice;

  return (
    <>
      {hasPriceRange ? (
        <>
          {formatPrice(minPrice, { currency: currencyCode })}
          {maxPrice && maxPrice > minPrice ? <>&ndash;{formatPrice(maxPrice, { currency: currencyCode })}</> : ''}
        </>
      ) : (
        <ProductVariantPrice variant={minVariant} currencyCode={currencyCode} />
      )}
    </>
  );
};
