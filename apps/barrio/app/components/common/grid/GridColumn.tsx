import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface GridColumnProps extends HTMLAttributes<HTMLElement> {}

export const GridColumn: FC<GridColumnProps> = ({ className, ...props }) => (
  <div className={clsx('col-span-12', className)} {...props} />
);
