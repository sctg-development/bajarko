import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface ActionsProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Actions: FC<ActionsProps> = ({ className, ...props }) => (
  <div className={clsx('mt-6 flex items-center gap-2', className)} {...props} />
);
