import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { MILLIS } from '../cache-builder.server';

export const listCategories = async function () {
  return cachified({
    key: 'list-categories',
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return _listCategories();
    },
  });
};

export const _listCategories = async function () {
  return sdk.store.category.list({ fields: '+category_children' }).then(({ product_categories }) => product_categories);
};
