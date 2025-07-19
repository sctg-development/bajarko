import { StoreCart, StoreCartAddress, StoreCustomer } from '@medusajs/types';

export const selectInitialShippingAddress = (cart: StoreCart, customer?: StoreCustomer) => {
  if (cart.shipping_address) return cart.shipping_address;

  if (!customer || !customer?.addresses?.length) return null;

  const customerAddress = customer?.default_shipping_address_id
    ? customer.addresses?.find((a) => a.id === customer?.default_shipping_address_id)
    : customer?.addresses?.[0];

  return (customerAddress as StoreCartAddress) || null;
};
