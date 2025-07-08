import { Button } from "@heroui/button";

import SeniaLayout from "@/layouts/senia";
import { useProducts, useRegions } from "@/lib/hooks/use-medusa";

/**
 * Demo page showing real Medusa API integration with the Senia layout
 * This demonstrates the complete multi-vendor storefront setup
 */
export default function ProductsDemo() {
    // Fetch products for the current seller
    const { data: productsData, loading: productsLoading, error: productsError } = useProducts({
        limit: 12,
        fields: "*variants,*variants.prices,*images,*collection,*categories"
    });

    // Fetch available regions
    const { data: regionsData, loading: regionsLoading } = useRegions();

    const formatPrice = (amount: number, currencyCode: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode.toUpperCase(),
        }).format(amount);
    };

    return (
        <SeniaLayout>
            <div className="space-y-12">
                {/* Header Section */}
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-light mb-6">
                        Our Products
                    </h1>
                    <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
                        Discover our exclusive collection of premium accessories,
                        curated specifically for the discerning customer.
                    </p>
                </section>

                {/* Region Info */}
                {regionsData && !regionsLoading && regionsData.regions && (
                    <section className="bg-neutral-50 rounded-2xl p-6">
                        <h3 className="font-medium mb-4">Available Regions</h3>
                        <div className="flex flex-wrap gap-2">
                            {regionsData.regions.map((region) => (
                                <span
                                    key={region.id}
                                    className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                                >
                                    {region.name} ({region.currency_code.toUpperCase()})
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Products Grid */}
                <section>
                    {productsError && (
                        <div className="bg-red-50 border border-red-200  p-6 text-center">
                            <h3 className="font-medium text-red-800 mb-2">Failed to load products</h3>
                            <p className="text-red-600 text-sm">{productsError}</p>
                            <p className="text-red-500 text-xs mt-2">
                                Make sure your Medusa backend is running at: {MEDUSA_BACKEND_URL}
                            </p>
                        </div>
                    )}

                    {productsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="bg-white  shadow-md overflow-hidden">
                                    <div className="w-full aspect-square bg-neutral-200 animate-pulse" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                                        <div className="h-3 bg-neutral-200 rounded w-2/3 animate-pulse" />
                                        <div className="h-6 bg-neutral-200 rounded w-1/3 animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : productsData?.products?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productsData.products.map((product) => {
                                const mainVariant = product.variants?.[0];
                                const price = mainVariant?.prices?.[0];
                                const image = product.thumbnail || product.images?.[0]?.url;

                                return (
                                    <div key={product.id} className="bg-white  shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                        {/* Product Image */}
                                        <div className="w-full aspect-square overflow-hidden">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjMtZjQtZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                                                    <span className="text-neutral-400 text-sm">No Image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-4 space-y-3">
                                            <div>
                                                <h3 className="font-medium text-lg line-clamp-2 mb-1">
                                                    {product.title}
                                                </h3>
                                                {product.description && (
                                                    <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                                                        {product.description}
                                                    </p>
                                                )}

                                                {/* Tags */}
                                                {product.tags && product.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-3">
                                                        {product.tags.slice(0, 2).map((tag) => (
                                                            <span key={tag.id} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                                                                {tag.value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Collection */}
                                                {product.collection && (
                                                    <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded border mb-3">
                                                        {product.collection.title}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="border-t pt-3" />

                                            <div className="flex items-center justify-between">
                                                {price ? (
                                                    <span className="text-xl font-semibold">
                                                        {formatPrice(price.amount, price.currency_code)}
                                                    </span>
                                                ) : (
                                                    <span className="text-neutral-500 italic">Price unavailable</span>
                                                )}

                                                <Button
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="px-6"
                                                >
                                                    View Details
                                                </Button>
                                            </div>

                                            {/* Variant count */}
                                            {product.variants && product.variants.length > 1 && (
                                                <p className="text-xs text-neutral-500">
                                                    {product.variants.length} variants available
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-medium text-neutral-600 mb-2">
                                No products found
                            </h3>
                            <p className="text-neutral-500">
                                This seller doesn't have any products yet, or they're not available in your region.
                            </p>
                        </div>
                    )}
                </section>

                {/* Debug Info */}
                <section className="bg-neutral-50 rounded-2xl p-6 text-sm">
                    <h3 className="font-medium mb-4">Debug Information</h3>
                    <div className="space-y-2 text-neutral-600">
                        <p><strong>Backend URL:</strong> {MEDUSA_BACKEND_URL}</p>
                        <p><strong>Publishable Key:</strong> {MEDUSA_PUBLISHABLE_KEY || "Not configured"}</p>
                        <p><strong>Seller ID:</strong> {MOTIHARU_SELLER_ID || "Not configured"}</p>
                        <p><strong>Products Found:</strong> {productsData?.products?.length || 0}</p>
                        <p><strong>Cache Status:</strong> Data is cached for 5 minutes</p>
                    </div>
                </section>
            </div>
        </SeniaLayout>
    );
}
