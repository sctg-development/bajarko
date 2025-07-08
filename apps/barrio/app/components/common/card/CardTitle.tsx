import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle: FC<CardTitleProps> = ({ className, children, ...props }) => (
  <h3 className={clsx('card__title mb-2 font-bold !leading-7', className)} {...props}>
    {children}
  </h3>
);
