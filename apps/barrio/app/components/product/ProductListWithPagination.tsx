import type { PaginationConfig } from '@app/components/common/Pagination';
import { PaginationWithContext } from '@app/components/common/Pagination/pagination-with-context';
import { ProductGrid, type ProductListProps } from '@app/components/product/ProductGrid';
import { StoreProduct } from '@medusajs/types';
import type { FC } from 'react';

export interface ProductListWithPaginationProps extends ProductListProps {
  products?: StoreProduct[];
  paginationConfig?: PaginationConfig;
  context: string;
}

export const ProductListWithPagination: FC<ProductListWithPaginationProps> = ({
  context,
  paginationConfig,
  ...props
}) => (
  <div>
    <ProductGrid {...props} />
    {paginationConfig && <PaginationWithContext context={context} paginationConfig={paginationConfig} />}
  </div>
);
