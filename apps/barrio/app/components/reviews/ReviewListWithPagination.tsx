import { StoreProductReview } from '@lambdacurry/medusa-plugins-sdk';
import { FC } from 'react';
import { PaginationConfig } from '../common/Pagination';
import { PaginationWithContext } from '../common/Pagination/pagination-with-context';
import { ProductReviewList, ProductReviewListProps } from './ProductReviewList';

export interface ProductReviewListWithPaginationProps extends ProductReviewListProps {
  productReviews: StoreProductReview[];
  paginationConfig?: PaginationConfig;
  context: string;
}

export const ProductReviewListWithPagination: FC<ProductReviewListWithPaginationProps> = ({
  context,
  paginationConfig,
  className,
  ...props
}) => (
  <>
    <div className={className}>
      <ProductReviewList {...props} />
      {paginationConfig && (
        <PaginationWithContext context={context} paginationConfig={paginationConfig} section={'reviews'} />
      )}
    </div>
  </>
);
