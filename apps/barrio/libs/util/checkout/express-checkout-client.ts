import { ExpressCheckoutFormData, ExpressCheckoutResponse } from 'storefront/app/routes/api.checkout.express';
import { convertToFormData } from '../forms';

export const expressCheckoutClient = {
  update: async (data: ExpressCheckoutFormData): Promise<[ExpressCheckoutResponse, null] | [null, Error]> => {
    const response = await fetch('/api/checkout/express', {
      method: 'POST',
      body: convertToFormData(data),
    });

    if (!response.ok) return [null, new Error('Failed to update shipping address')];

    return [(await response.json()) as ExpressCheckoutResponse, null];
  },
};
