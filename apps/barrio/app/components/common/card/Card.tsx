import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLElement> {}

export const Card: FC<CardProps> = ({ className, ...props }) => (
  <article className={clsx('card flex flex-col rounded bg-white shadow-md', className)} {...props} />
);
