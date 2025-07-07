/**
 * Medusa API client initialization and exports
 * 
 * This file provides a configured instance of the Medusa client
 * with the environment variables from Vite's define configuration
 */

import { MedusaClient } from "./medusa-client";

/**
 * Default Medusa client instance configured with environment variables
 * 
 * This client is automatically configured with:
 * - MEDUSA_BACKEND_URL: The base URL of your Medusa backend
 * - MEDUSA_PUBLISHABLE_KEY: The publishable key for store access
 * - MOTIHARU_SELLER_ID: The seller ID for multi-vendor filtering
 */
export const medusaClient = new MedusaClient({
    baseUrl: MEDUSA_BACKEND_URL,
    publishableKey: MEDUSA_PUBLISHABLE_KEY,
    sellerId: MOTIHARU_SELLER_ID,
});

/**
 * Create a new Medusa client with custom configuration
 * 
 * @param config - Custom configuration options
 * @returns A new MedusaClient instance
 */
export function createMedusaClient(config: {
    baseUrl?: string;
    publishableKey?: string;
    sellerId?: string;
    cache?: {
        defaultTTL?: number;
        maxEntries?: number;
    };
} = {}) {
    return new MedusaClient({
        baseUrl: config.baseUrl || MEDUSA_BACKEND_URL,
        publishableKey: config.publishableKey || MEDUSA_PUBLISHABLE_KEY,
        sellerId: config.sellerId || MOTIHARU_SELLER_ID,
        cache: config.cache ? {
            defaultTTL: config.cache.defaultTTL ?? 5 * 60 * 1000,
            maxEntries: config.cache.maxEntries ?? 100,
        } : undefined,
    });
}

// Re-export the client class for direct usage
export { MedusaClient } from "./medusa-client";

// Re-export types
export type {
    MedusaClientConfig,
    MedusaProduct,
    MedusaRegion,
    MedusaProductFilters,
    MedusaRegionFilters,
    MedusaListResponse,
    MedusaSingleResponse,
} from "../types/medusa";
