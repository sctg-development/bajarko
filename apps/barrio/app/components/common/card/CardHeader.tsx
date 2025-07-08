import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface CardHeaderProps extends HTMLAttributes<HTMLElement> {}

export const CardHeader: FC<CardHeaderProps> = ({ className, ...props }) => (
  <header
    className={clsx('card__header flex w-full flex-grow-0 items-center justify-between self-start', className)}
    {...props}
  />
);
