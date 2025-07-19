import { SiteSettings } from '@libs/types';
import { config } from '@libs/util/server/config.server';

export const siteSettings: SiteSettings = {
  storefront_url: config.STOREFRONT_URL,
  description: '',
  favicon: '/favicon.svg',
  social_facebook: 'https://www.facebook.com/',
  social_instagram: 'https://www.instagram.com/',
  social_twitter: 'https://www.twitter.com/',
};
