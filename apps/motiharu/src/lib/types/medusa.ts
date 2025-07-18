// Types for Medusa API responses
export interface MedusaProduct {
    id: string;
    title: string;
    description?: string;
    handle: string;
    status: string;
    thumbnail?: string;
    images?: MedusaImage[];
    variants: MedusaProductVariant[];
    options?: MedusaProductOption[];
    tags?: MedusaProductTag[];
    type?: MedusaProductType;
    collection?: MedusaProductCollection;
    categories?: MedusaProductCategory[];
    created_at: string;
    updated_at: string;
}

export interface MedusaProductVariant {
    id: string;
    title: string;
    sku?: string;
    barcode?: string;
    ean?: string;
    upc?: string;
    variant_rank?: number;
    inventory_quantity: number;
    allow_backorder: boolean;
    manage_inventory: boolean;
    weight?: number;
    length?: number;
    height?: number;
    width?: number;
    origin_country?: string;
    mid_code?: string;
    material?: string;
    metadata?: Record<string, unknown>;
    prices: MedusaPrice[];
    options: MedusaProductOptionValue[];
    product_id: string;
    created_at: string;
    updated_at: string;
}

export interface MedusaPrice {
    id: string;
    currency_code: string;
    amount: number;
    min_quantity?: number;
    max_quantity?: number;
    price_set_id: string;
}

export interface MedusaImage {
    id: string;
    url: string;
    metadata?: Record<string, unknown>;
}

export interface MedusaProductOption {
    id: string;
    title: string;
    product_id: string;
    metadata?: Record<string, unknown>;
    values: MedusaProductOptionValue[];
}

export interface MedusaProductOptionValue {
    id: string;
    value: string;
    option_id: string;
    variant_id: string;
    metadata?: Record<string, unknown>;
}

export interface MedusaProductTag {
    id: string;
    value: string;
    metadata?: Record<string, unknown>;
}

export interface MedusaProductType {
    id: string;
    value: string;
    metadata?: Record<string, unknown>;
}

export interface MedusaProductCollection {
    id: string;
    title: string;
    handle: string;
    metadata?: Record<string, unknown>;
}

export interface MedusaProductCategory {
    id: string;
    name: string;
    handle: string;
    parent_category_id?: string;
    metadata?: Record<string, unknown>;
}

export interface MedusaRegion {
    id: string;
    name: string;
    currency_code: string;
    tax_rate: number;
    tax_code?: string;
    gift_cards_taxable: boolean;
    automatic_taxes: boolean;
    countries: MedusaCountry[];
    payment_providers: MedusaPaymentProvider[];
    fulfillment_providers: MedusaFulfillmentProvider[];
    metadata?: Record<string, unknown>;
}

export interface MedusaCountry {
    id: string;
    iso_2: string;
    iso_3: string;
    num_code: number;
    name: string;
    display_name: string;
    region_id?: string;
}

export interface MedusaPaymentProvider {
    id: string;
    is_enabled: boolean;
}

export interface MedusaFulfillmentProvider {
    id: string;
    is_enabled: boolean;
}

// API Response wrappers
export interface MedusaListResponse<T> {
    products?: T[];
    regions?: T[];
    collections?: T[];
    categories?: T[];
    count: number;
    offset: number;
    limit: number;
}

export interface MedusaSingleResponse<T> {
    product?: T;
    region?: T;
    collection?: T;
    category?: T;
}

// Query parameters for Medusa Store API
export interface MedusaProductFilters {
    q?: string;
    id?: string | string[];
    collection_id?: string | string[];
    category_id?: string | string[];
    type_id?: string | string[];
    tag?: string | string[];
    title?: string;
    description?: string;
    handle?: string;
    is_giftcard?: boolean;
    created_at?: {
        lt?: string;
        gt?: string;
        lte?: string;
        gte?: string;
    };
    updated_at?: {
        lt?: string;
        gt?: string;
        lte?: string;
        gte?: string;
    };
    offset?: number;
    limit?: number;
    order?: string;
    fields?: string;
    currency_code?: string;
    region_id?: string;
}

export interface MedusaRegionFilters {
    offset?: number;
    limit?: number;
    fields?: string;
    expand?: string;
}

// Cache related types
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

export interface CacheConfig {
    defaultTTL: number; // in milliseconds
    maxEntries: number;
}

// API Client config
export interface MedusaClientConfig {
    baseUrl: string;
    publishableKey: string;
    sellerId?: string;
    cache?: CacheConfig;
}

// Error types
export interface MedusaError {
    code: string;
    message: string;
    type: string;
}
