import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface FieldGroupProps extends HTMLAttributes<HTMLDivElement> {}

export const FieldGroup: FC<FieldGroupProps> = ({ className, ...props }) => (
  <div className={clsx('field-group my-6 grid grid-cols-12 gap-x-3 gap-y-4 sm:gap-x-4', className)} {...props} />
);
