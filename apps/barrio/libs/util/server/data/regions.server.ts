import cachified from '@epic-web/cachified';
import { medusaError } from '@libs/util/medusaError';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { StoreRegionCountry } from '@medusajs/types';
import { getSelectedRegionId } from '../cookies.server';

const ONE_HOUR_IN_MS = 3_600_000;

export const getCountryCode = (country: StoreRegionCountry) => {
  return country?.iso_2 as string;
};

export const listRegions = async function () {
  return cachified({
    key: 'list-regions',
    cache: sdkCache,
    staleWhileRevalidate: ONE_HOUR_IN_MS,
    ttl: 10_000,
    async getFreshValue() {
      return _listRegions();
    },
  });
};

export const _listRegions = async function () {
  return sdk.store.region
    .list({})
    .then(({ regions }) => regions)
    .catch(medusaError);
};

export const _retrieveRegion = async function (id: string) {
  return sdk.store.region
    .retrieve(id, {})
    .then(({ region }) => region)
    .catch(medusaError);
};

export const retrieveRegion = async function (id: string) {
  return cachified({
    key: `region-${id}`,
    cache: sdkCache,
    staleWhileRevalidate: 150_000,
    ttl: 10_000,
    async getFreshValue() {
      return _retrieveRegion(id);
    },
  });
};

export const getDefaultRegion = async function () {
  const regions = await listRegions().catch((err) => {
    console.error(err);
    return [];
  });
  return regions.sort((r) => (r.countries?.some((c) => c.iso_2 === 'us') ? -1 : 1))[0];
};

export const getSelectedRegion = async (headers: Headers) => {
  const regionId = await getSelectedRegionId(headers);

  if (regionId) {
    try {
      return await retrieveRegion(regionId);
    } catch (e) {
      console.warn('RegionId is not valid, using default region');
    }
  }

  return await getDefaultRegion();
};
