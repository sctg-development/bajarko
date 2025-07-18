import { useState, useEffect, useCallback } from "react";
import type {
    MedusaProduct,
    MedusaRegion,
    MedusaProductFilters,
    MedusaRegionFilters,
    MedusaListResponse,
    MedusaSingleResponse,
} from "../types/medusa";
import { medusaClient } from "../api";

// Generic hook state
interface UseQueryState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for listing products with caching
 */
export function useProducts(
    filters: MedusaProductFilters = {},
    options: { enabled?: boolean; ttl?: number } = {}
): UseQueryState<MedusaListResponse<MedusaProduct>> {
    const [data, setData] = useState<MedusaListResponse<MedusaProduct> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (options.enabled === false) return;

        try {
            setLoading(true);
            setError(null);
            const result = await medusaClient.listProducts(filters, options.ttl);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [filters, options.enabled, options.ttl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

/**
 * Hook for getting a single product
 */
export function useProduct(
    id: string,
    params: {
        fields?: string;
        expand?: string;
        currency_code?: string;
        region_id?: string;
    } = {},
    options: { enabled?: boolean; ttl?: number } = {}
): UseQueryState<MedusaSingleResponse<MedusaProduct>> {
    const [data, setData] = useState<MedusaSingleResponse<MedusaProduct> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!id || options.enabled === false) return;

        try {
            setLoading(true);
            setError(null);
            const result = await medusaClient.getProduct(id, params, options.ttl);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [id, params, options.enabled, options.ttl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

/**
 * Hook for searching products
 */
export function useProductSearch(
    query: string,
    filters: Omit<MedusaProductFilters, "q"> = {},
    options: { enabled?: boolean; ttl?: number } = {}
): UseQueryState<MedusaListResponse<MedusaProduct>> {
    const [data, setData] = useState<MedusaListResponse<MedusaProduct> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!query || options.enabled === false) {
            setData(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await medusaClient.searchProducts(query, filters, options.ttl);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [query, filters, options.enabled, options.ttl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

/**
 * Hook for getting products by collection
 */
export function useProductsByCollection(
    collectionId: string,
    filters: Omit<MedusaProductFilters, "collection_id"> = {},
    options: { enabled?: boolean; ttl?: number } = {}
): UseQueryState<MedusaListResponse<MedusaProduct>> {
    const [data, setData] = useState<MedusaListResponse<MedusaProduct> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!collectionId || options.enabled === false) return;

        try {
            setLoading(true);
            setError(null);
            const result = await medusaClient.getProductsByCollection(collectionId, filters, options.ttl);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [collectionId, filters, options.enabled, options.ttl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

/**
 * Hook for getting products by category
 */
export function useProductsByCategory(
    categoryId: string,
    filters: Omit<MedusaProductFilters, "category_id"> = {},
    expand?: string,
    options: { enabled?: boolean; ttl?: number } = {}
): UseQueryState<MedusaListResponse<MedusaProduct>> {
    const [data, setData] = useState<MedusaListResponse<MedusaProduct> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!categoryId || options.enabled === false) return;

        try {
            setLoading(true);
            setError(null);
            const result = await medusaClient.getProductsByCategory(categoryId, filters, options.ttl);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [categoryId, filters, expand, options.enabled, options.ttl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

/**
 * Hook for listing regions
 */
export function useRegions(
    filters: MedusaRegionFilters = {},
    options: { enabled?: boolean; ttl?: number } = {}
): UseQueryState<MedusaListResponse<MedusaRegion>> {
    const [data, setData] = useState<MedusaListResponse<MedusaRegion> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (options.enabled === false) return;

        try {
            setLoading(true);
            setError(null);
            const result = await medusaClient.listRegions(filters, options.ttl);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [filters, options.enabled, options.ttl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

/**
 * Hook for getting a single region
 */
export function useRegion(
    id: string,
    params: { fields?: string; expand?: string } = {},
    options: { enabled?: boolean; ttl?: number } = {}
): UseQueryState<MedusaSingleResponse<MedusaRegion>> {
    const [data, setData] = useState<MedusaSingleResponse<MedusaRegion> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!id || options.enabled === false) return;

        try {
            setLoading(true);
            setError(null);
            const result = await medusaClient.getRegion(id, params, options.ttl);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [id, params, options.enabled, options.ttl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

/**
 * Hook for cache management
 */
export function useMedusaCache() {
    const invalidateProductCache = useCallback(() => {
        medusaClient.invalidateProductCache();
    }, []);

    const invalidateCache = useCallback((endpoint: string, params?: Record<string, any>) => {
        medusaClient.invalidateCache(endpoint, params);
    }, []);

    const clearCache = useCallback(() => {
        medusaClient.clearCache();
    }, []);

    const getCacheStats = useCallback(() => {
        return medusaClient.getCacheStats();
    }, []);

    return {
        invalidateProductCache,
        invalidateCache,
        clearCache,
        getCacheStats,
    };
}
