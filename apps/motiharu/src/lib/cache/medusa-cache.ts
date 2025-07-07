import type { CacheEntry, CacheConfig } from "../types/medusa";

/**
 * Simple in-memory cache implementation for Medusa API responses
 * Provides TTL-based expiration and LRU eviction
 */
export class MedusaCache {
    private cache = new Map<string, CacheEntry<any>>();
    private accessOrder = new Map<string, number>();
    private accessCounter = 0;
    private config: Required<CacheConfig>;

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            defaultTTL: config.defaultTTL ?? 5 * 60 * 1000, // 5 minutes default
            maxEntries: config.maxEntries ?? 100,
        };
    }

    /**
     * Generate cache key from endpoint and parameters
     */
    private generateKey(endpoint: string, params?: Record<string, any>): string {
        if (!params) return endpoint;

        const sortedParams = Object.keys(params)
            .sort()
            .reduce((acc, key) => {
                if (params[key] !== undefined && params[key] !== null) {
                    acc[key] = params[key];
                }
                return acc;
            }, {} as Record<string, any>);

        return `${endpoint}:${JSON.stringify(sortedParams)}`;
    }

    /**
     * Check if a cache entry is still valid
     */
    private isValid(entry: CacheEntry<any>): boolean {
        return Date.now() - entry.timestamp < entry.ttl;
    }

    /**
     * Remove expired entries
     */
    private cleanup(): void {
        const now = Date.now();
        const toDelete: string[] = [];

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp >= entry.ttl) {
                toDelete.push(key);
            }
        }

        toDelete.forEach(key => {
            this.cache.delete(key);
            this.accessOrder.delete(key);
        });
    }

    /**
     * Evict least recently used entries if cache is full
     */
    private evictLRU(): void {
        if (this.cache.size < this.config.maxEntries) return;

        // Find the least recently used entry
        let oldestKey: string | null = null;
        let oldestAccess = Infinity;

        for (const [key, accessTime] of this.accessOrder.entries()) {
            if (accessTime < oldestAccess) {
                oldestAccess = accessTime;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.accessOrder.delete(oldestKey);
        }
    }

    /**
     * Update access order for LRU tracking
     */
    private updateAccessOrder(key: string): void {
        this.accessOrder.set(key, ++this.accessCounter);
    }

    /**
     * Get data from cache
     */
    get<T>(endpoint: string, params?: Record<string, any>): T | null {
        this.cleanup();

        const key = this.generateKey(endpoint, params);
        const entry = this.cache.get(key);

        if (!entry || !this.isValid(entry)) {
            if (entry) {
                this.cache.delete(key);
                this.accessOrder.delete(key);
            }
            return null;
        }

        this.updateAccessOrder(key);
        return entry.data;
    }

    /**
     * Set data in cache
     */
    set<T>(
        endpoint: string,
        data: T,
        params?: Record<string, any>,
        ttl?: number
    ): void {
        this.cleanup();
        this.evictLRU();

        const key = this.generateKey(endpoint, params);
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttl ?? this.config.defaultTTL,
        };

        this.cache.set(key, entry);
        this.updateAccessOrder(key);
    }

    /**
     * Invalidate specific cache entry
     */
    invalidate(endpoint: string, params?: Record<string, any>): void {
        const key = this.generateKey(endpoint, params);
        this.cache.delete(key);
        this.accessOrder.delete(key);
    }

    /**
     * Invalidate all cache entries matching a pattern
     */
    invalidatePattern(pattern: string): void {
        const regex = new RegExp(pattern);
        const toDelete: string[] = [];

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                toDelete.push(key);
            }
        }

        toDelete.forEach(key => {
            this.cache.delete(key);
            this.accessOrder.delete(key);
        });
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
        this.accessOrder.clear();
        this.accessCounter = 0;
    }

    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        maxEntries: number;
        hitRate: number;
        entries: Array<{ key: string; timestamp: number; ttl: number; size: string }>;
    } {
        const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
            key,
            timestamp: entry.timestamp,
            ttl: entry.ttl,
            size: JSON.stringify(entry.data).length + " bytes",
        }));

        return {
            size: this.cache.size,
            maxEntries: this.config.maxEntries,
            hitRate: 0, // Could be calculated with hit/miss counters
            entries,
        };
    }
}

// Global cache instance
export const medusaCache = new MedusaCache();
