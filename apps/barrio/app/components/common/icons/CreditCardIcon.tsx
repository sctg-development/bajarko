import HeroCreditCardIcon from '@heroicons/react/24/solid/CreditCardIcon';
import { type CreditCardBrand } from '@libs/types';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';
import {
  AmericanExpressIcon,
  DinersClubIcon,
  DiscoverIcon,
  JCBIcon,
  MasterCardIcon,
  UnionPayIcon,
  VisaIcon,
} from '../assets/icons';

export interface CreditCardIconProps extends HTMLAttributes<HTMLSpanElement> {
  brand: CreditCardBrand;
}

export const brandToIconMap = {
  amex: AmericanExpressIcon,
  diners: DinersClubIcon,
  discover: DiscoverIcon,
  jcb: JCBIcon,
  mastercard: MasterCardIcon,
  visa: VisaIcon,
  unionpay: UnionPayIcon,
  unknown: HeroCreditCardIcon,
};

export const CreditCardIcon: FC<CreditCardIconProps> = ({ brand, className, ...props }) => {
  const Icon = brandToIconMap[brand as CreditCardBrand];

  return (
    <i className={clsx('credit-card-icon inline-block h-6 w-8', className)} {...props}>
      <Icon className="h-full w-full" />
    </i>
  );
};
