import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface CardDateProps extends HTMLAttributes<HTMLSpanElement> {}

export const CardDate: FC<CardDateProps> = ({ className, ...props }) => (
  <span className={clsx('card__date text-right text-xs', className)} {...props} />
);
