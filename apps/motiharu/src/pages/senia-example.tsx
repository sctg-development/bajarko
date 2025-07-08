import { Button } from "@heroui/button";

import SeniaLayout from "@/layouts/senia";
import { useProducts } from "@/lib/hooks/use-medusa";

export default function HomePage() {
    // Fetch featured products
    const { data: productsData, loading: productsLoading } = useProducts({
        limit: 3,
        //expand: "variants,images",
    });

    const formatPrice = (amount: number, currencyCode: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode.toUpperCase(),
        }).format(amount / 100);
    };

    return (
        <SeniaLayout>
            <div className="space-y-16">
                {/* Featured Section */}
                <section className="text-center">
                    <h2 className="text-3xl md:text-4xl font-light mb-6">Featured Collections</h2>
                    <p className="text-neutral-600 max-w-2xl mx-auto mb-12">
                        Explore our carefully curated selection of premium accessories designed for the modern lifestyle.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {productsLoading ? (
                            // Loading skeletons
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="group cursor-pointer">
                                    <div className="aspect-square bg-neutral-200 mb-4  overflow-hidden animate-pulse" />
                                    <div className="h-6 bg-neutral-200 rounded mb-2 animate-pulse" />
                                    <div className="h-4 bg-neutral-200 rounded w-2/3 animate-pulse" />
                                </div>
                            ))
                        ) : productsData?.products?.length ? (
                            // Real products from Medusa
                            productsData.products.slice(0, 3).map((product) => {
                                const price = product.variants?.[0]?.prices?.[0];
                                const image = product.thumbnail || product.images?.[0]?.url;

                                return (
                                    <div key={product.id} className="group cursor-pointer">
                                        <div className="aspect-square bg-neutral-100 mb-4  overflow-hidden">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjMtZjQtZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                                                    <span className="text-neutral-400 text-sm">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-medium mb-2">{product.title}</h3>
                                        <p className="text-neutral-600 text-sm">
                                            {price
                                                ? `Starting from ${formatPrice(price.amount, price.currency_code)}`
                                                : "Price on request"
                                            }
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            // Fallback static content
                            <>
                                <div className="group cursor-pointer">
                                    <div className="aspect-square bg-neutral-100 mb-4  overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <h3 className="font-medium mb-2">Luxury Handbags</h3>
                                    <p className="text-neutral-600 text-sm">Connect to Medusa to load products</p>
                                </div>

                                <div className="group cursor-pointer">
                                    <div className="aspect-square bg-neutral-100 mb-4  overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <h3 className="font-medium mb-2">Evening Clutches</h3>
                                    <p className="text-neutral-600 text-sm">Connect to Medusa to load products</p>
                                </div>

                                <div className="group cursor-pointer">
                                    <div className="aspect-square bg-neutral-100 mb-4  overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <h3 className="font-medium mb-2">Travel Accessories</h3>
                                    <p className="text-neutral-600 text-sm">Connect to Medusa to load products</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* View All Products Button */}
                    <div className="mt-12">
                        <Button
                            size="lg"
                            variant="bordered"
                            className="px-8"
                        >
                            View All Products
                        </Button>
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-neutral-50 -mx-6 px-6 py-16 rounded-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-light mb-6">Our Story</h2>
                            <p className="text-neutral-600 mb-6">
                                Founded with a passion for exceptional craftsmanship and timeless design, we create accessories
                                that elevate your everyday moments into extraordinary experiences.
                            </p>
                            <p className="text-neutral-600 mb-8">
                                Each piece in our collection is carefully selected for its quality, attention to detail,
                                and ability to complement your unique style.
                            </p>
                            <Button
                                size="lg"
                                color="primary"
                                className="px-8"
                            >
                                Discover Our Process
                            </Button>
                        </div>
                        <div className="aspect-square bg-neutral-200 " />
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="text-center py-16">
                    <h2 className="text-2xl md:text-3xl font-light mb-4">Stay in Touch</h2>
                    <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                        Be the first to know about new collections, exclusive offers, and style inspiration.
                    </p>
                    <div className="max-w-md mx-auto flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 border border-neutral-300  focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <Button
                            size="lg"
                            color="primary"
                            className="px-6"
                        >
                            Subscribe
                        </Button>
                    </div>
                </section>
            </div>
        </SeniaLayout>
    );
}
