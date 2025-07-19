import cachified from '@epic-web/cachified';
import { medusaError } from '@libs/util/medusaError';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { HttpTypes } from '@medusajs/types';
import { MILLIS } from '../cache-builder.server';

export const retrieveCollection = async function (id: string) {
  return sdk.store.collection.retrieve(id, {}).then(({ collection }) => collection);
};

export const fetchCollections = async function (
  offset: number = 0,
  limit: number = 100,
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  return cachified({
    key: `collections-${JSON.stringify({ offset, limit })}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return _fetchCollections(offset, limit);
    },
  });
};

export const _fetchCollections = async function (
  offset: number = 0,
  limit: number = 100,
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  return sdk.store.collection
    .list({ limit, offset })
    .then(({ collections }) => ({ collections, count: collections.length }));
};

export const getCollectionByHandle = async function (handle: string): Promise<HttpTypes.StoreCollection> {
  return sdk.store.collection
    .list({ handle })
    .then(({ collections }) => collections[0])
    .catch(medusaError);
};
