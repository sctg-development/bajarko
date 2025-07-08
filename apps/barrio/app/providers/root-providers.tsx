import { StorefrontProvider, storefrontInitialState } from '@app/providers/storefront-provider';
import { FC, PropsWithChildren } from 'react';

export const RootProviders: FC<PropsWithChildren> = ({ children }) => (
  <StorefrontProvider data={storefrontInitialState}>{children}</StorefrontProvider>
);
