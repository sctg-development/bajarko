import { CartDrawer } from '@app/components/cart/CartDrawer';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { Footer } from './footer/Footer';
import { Header } from './header/Header';
export interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ className, children }) => {
  return (
    <div className={clsx('page-layout flex min-h-screen flex-col bg-highlight-50', className)}>
      <CartDrawer />
      <Header />
      <main className="flex-auto">
        <div className="w-full">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
