import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {}

export const SectionHeading: FC<SectionHeadingProps> = ({ className, ...props }) => (
  <h2 className={clsx('text-4xl font-extrabold', className)} {...props} />
);
