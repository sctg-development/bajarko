import type {
    MedusaClientConfig,
    MedusaProduct,
    MedusaRegion,
    MedusaProductFilters,
    MedusaRegionFilters,
    MedusaListResponse,
    MedusaSingleResponse,
    MedusaError,
} from "../types/medusa";
import { medusaCache } from "../cache/medusa-cache";

/**
 * Medusa API Client with caching support for multi-vendor storefront
 */
export class MedusaClient {
    private config: Required<MedusaClientConfig>;

    constructor(config: MedusaClientConfig) {
        this.config = {
            baseUrl: config.baseUrl,
            publishableKey: config.publishableKey,
            sellerId: config.sellerId ?? "",
            cache: config.cache ?? { defaultTTL: 5 * 60 * 1000, maxEntries: 100 },
        };
    }

    /**
     * Build headers for API requests
     */
    private buildHeaders(): HeadersInit {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (this.config.publishableKey) {
            headers["x-publishable-api-key"] = this.config.publishableKey;
        }

        // Add seller_id header for multi-vendor support
        if (this.config.sellerId) {
            headers["seller_id"] = this.config.sellerId;
        }

        return headers;
    }

    /**
     * Build URL with query parameters
     */
    private buildUrl(endpoint: string, params?: Record<string, any>): string {
        const url = new URL(endpoint, this.config.baseUrl);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach(v => url.searchParams.append(key, String(v)));
                    } else if (typeof value === "object") {
                        // Handle nested objects like created_at: { gt: "2023-01-01" }
                        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                            if (nestedValue !== undefined && nestedValue !== null) {
                                url.searchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
                            }
                        });
                    } else {
                        url.searchParams.append(key, String(value));
                    }
                }
            });
        }

        return url.toString();
    }

    /**
     * Make HTTP request with error handling
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        params?: Record<string, any>
    ): Promise<T> {
        const url = this.buildUrl(endpoint, params);
        const headers = this.buildHeaders();

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const errorData: MedusaError = await response.json().catch(() => ({
                    code: `HTTP_${response.status}`,
                    message: response.statusText,
                    type: "api_error",
                }));

                throw new Error(`Medusa API Error: ${errorData.message} (${errorData.code})`);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Network error: ${String(error)}`);
        }
    }

    /**
     * Cached GET request
     */
    private async cachedRequest<T>(
        endpoint: string,
        params?: Record<string, any>,
        ttl?: number
    ): Promise<T> {
        // Try to get from cache first
        const cached = medusaCache.get<T>(endpoint, params);
        if (cached) {
            return cached;
        }

        // Make API request
        const data = await this.request<T>(endpoint, { method: "GET" }, params);

        // Cache the response
        medusaCache.set(endpoint, data, params, ttl);

        return data;
    }

    // Products API

    /**
     * List products with filtering and caching
     */
    async listProducts(
        filters: MedusaProductFilters = {},
        ttl?: number
    ): Promise<MedusaListResponse<MedusaProduct>> {
        return this.cachedRequest<MedusaListResponse<MedusaProduct>>(
            "/store/products",
            filters,
            ttl
        );
    }

    /**
     * Get a single product by ID
     */
    async getProduct(
        id: string,
        params: {
            fields?: string;
            expand?: string;
            currency_code?: string;
            region_id?: string;
        } = {},
        ttl?: number
    ): Promise<MedusaSingleResponse<MedusaProduct>> {
        return this.cachedRequest<MedusaSingleResponse<MedusaProduct>>(
            `/store/products/${id}`,
            params,
            ttl
        );
    }

    /**
     * Search products by query
     */
    async searchProducts(
        query: string,
        filters: Omit<MedusaProductFilters, "q"> = {},
        ttl?: number
    ): Promise<MedusaListResponse<MedusaProduct>> {
        return this.listProducts({ ...filters, q: query }, ttl);
    }

    /**
     * Get products by collection
     */
    async getProductsByCollection(
        collectionId: string,
        filters: Omit<MedusaProductFilters, "collection_id"> = {},
        ttl?: number
    ): Promise<MedusaListResponse<MedusaProduct>> {
        return this.listProducts({ ...filters, collection_id: collectionId }, ttl);
    }

    /**
     * Get products by category
     */
    async getProductsByCategory(
        categoryId: string,
        filters: Omit<MedusaProductFilters, "category_id"> = {},
        ttl?: number
    ): Promise<MedusaListResponse<MedusaProduct>> {
        return this.listProducts({ ...filters, category_id: categoryId }, ttl);
    }

    // Regions API

    /**
     * List regions
     */
    async listRegions(
        filters: MedusaRegionFilters = {},
        ttl?: number
    ): Promise<MedusaListResponse<MedusaRegion>> {
        return this.cachedRequest<MedusaListResponse<MedusaRegion>>(
            "/store/regions",
            filters,
            ttl
        );
    }

    /**
     * Get a single region by ID
     */
    async getRegion(
        id: string,
        params: { fields?: string; expand?: string } = {},
        ttl?: number
    ): Promise<MedusaSingleResponse<MedusaRegion>> {
        return this.cachedRequest<MedusaSingleResponse<MedusaRegion>>(
            `/store/regions/${id}`,
            params,
            ttl
        );
    }

    // Cache management

    /**
     * Invalidate cache for specific endpoint
     */
    invalidateCache(endpoint: string, params?: Record<string, any>): void {
        medusaCache.invalidate(endpoint, params);
    }

    /**
     * Invalidate all product-related cache
     */
    invalidateProductCache(): void {
        medusaCache.invalidatePattern("^/store/products");
    }

    /**
     * Clear all cache
     */
    clearCache(): void {
        medusaCache.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return medusaCache.getStats();
    }
}
