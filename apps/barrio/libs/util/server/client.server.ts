import { MedusaPluginsSDK } from '@lambdacurry/medusa-plugins-sdk';
import { buildNewLRUCache } from './cache-builder.server';
import { config } from './config.server';

export const baseMedusaConfig = {
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: config.MEDUSA_PUBLISHABLE_KEY,
  globalHeaders: {
    'seller_id': BARRIO_SELLER_ID,
  }
};

export const sdk = new MedusaPluginsSDK({
  ...baseMedusaConfig,
});

export const sdkCache = buildNewLRUCache({ max: 1000 });
