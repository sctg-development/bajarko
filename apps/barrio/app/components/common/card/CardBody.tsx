import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface CardBodyProps extends HTMLAttributes<HTMLElement> {}

export const CardBody: FC<CardBodyProps> = ({ className, ...props }) => (
  <header className={clsx('card__body flex-grow', className)} {...props} />
);
