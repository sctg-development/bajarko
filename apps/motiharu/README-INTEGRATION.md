# Motiharu Storefront - Multi-Vendor Medusa Integration

This document explains how to use the implemented Medusa API integration with local caching and multi-vendor support.

## Environment Setup

Set the following environment variables:

```bash
# Backend URL
MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable API key (optional, for published products only)
MEDUSA_PUBLISHABLE_KEY=your-publishable-key

# Seller ID for multi-vendor support
MOTIHARU_SELLER_ID=your-seller-id
```

## Architecture Overview

The storefront is built with:

- **Vite + React 19** for modern development
- **HeroUI** for UI components
- **Senia-inspired layout** with responsive hero image
- **Local caching** for API performance
- **Multi-vendor support** via seller_id header

## Key Components

### 1. Medusa API Client (`src/lib/api/medusa-client.ts`)

Type-safe API client with automatic caching:

```typescript
import { medusaClient } from "@/lib/api/medusa-client";

// List products with filtering
const products = await medusaClient.listProducts({
  limit: 20,
  expand: "variants,images,collection"
});

// Get single product
const product = await medusaClient.getProduct("prod_123", {
  expand: "variants,images"
});

// Search products
const searchResults = await medusaClient.searchProducts("handbag");
```

### 2. React Hooks (`src/lib/hooks/use-medusa.ts`)

Easy-to-use hooks for React components:

```typescript
import { useProducts, useProduct, useRegions } from "@/lib/hooks/use-medusa";

function ProductList() {
  const { data, loading, error, refetch } = useProducts({
    limit: 12,
    expand: "variants,images"
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.products?.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

### 3. Caching System (`src/lib/cache/medusa-cache.ts`)

Automatic in-memory caching with TTL and LRU eviction:

- **Default TTL**: 5 minutes
- **Max entries**: 100
- **Automatic cleanup** of expired entries
- **Cache invalidation** support

### 4. Senia Layout (`src/layouts/senia.tsx`)

Beautiful layout with:
- Full-width hero image (responsive)
- Dark navbar overlay
- Modern footer
- Responsive design

```typescript
import SeniaLayout from "@/layouts/senia";

export default function MyPage() {
  return (
    <SeniaLayout>
      <div>Your content here</div>
    </SeniaLayout>
  );
}
```

## Multi-Vendor Support

The system automatically includes the `seller_id` header in all API requests:

```typescript
// Backend middleware checks this header
headers: {
  "seller_id": "your-seller-id"
}
```

Your Medusa backend should filter products by seller_id in the middleware.

## Type Safety

All Medusa entities are fully typed:

```typescript
import type { 
  MedusaProduct, 
  MedusaRegion, 
  MedusaProductVariant 
} from "@/lib/types/medusa";
```

## Example Usage

See `src/pages/products-demo.tsx` for a complete example showing:

- Product listing with images
- Price formatting
- Error handling
- Loading states
- Region information
- Debug information

## Backend Requirements

Your Medusa backend needs:

1. **Multi-vendor middleware** that filters by seller_id
2. **CORS configuration** for your domain
3. **Product images** properly configured
4. **Regions** set up for price display

## Performance Features

- **Automatic caching** of all GET requests
- **Request deduplication** (same requests are cached)
- **Optimized bundle splitting** for HeroUI components
- **Lazy loading** support for images
- **Responsive images** with fallbacks

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Error Handling

The system provides comprehensive error handling:

- **Network errors** are caught and displayed
- **API errors** show Medusa error messages
- **Loading states** prevent UI flashing
- **Fallback images** for missing product images

## Future Enhancements

Consider adding:

- **Persistent caching** (IndexedDB/localStorage)
- **Offline support** with service workers
- **Image optimization** with WebP/AVIF
- **Infinite scrolling** for product lists
- **Search functionality** with filters
- **Cart management** with local storage
- **User authentication** and accounts

## Troubleshooting

### No products showing?

1. Check if MEDUSA_BACKEND_URL is correct
2. Verify seller_id is configured properly
3. Ensure backend is running and accessible
4. Check network tab for API errors

### Images not loading?

1. Verify image URLs in Medusa admin
2. Check CORS settings for image domains
3. Ensure proper image storage configuration

### Cache not working?

1. Check browser developer tools
2. Verify cache TTL settings
3. Look for console errors in cache module
