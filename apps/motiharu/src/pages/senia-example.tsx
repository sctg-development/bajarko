import SeniaLayout from "@/layouts/senia";

export default function HomePage() {
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
                        <div className="group cursor-pointer">
                            <div className="aspect-square bg-neutral-100 mb-4 rounded-lg overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <h3 className="font-medium mb-2">Luxury Handbags</h3>
                            <p className="text-neutral-600 text-sm">Starting from $299</p>
                        </div>

                        <div className="group cursor-pointer">
                            <div className="aspect-square bg-neutral-100 mb-4 rounded-lg overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <h3 className="font-medium mb-2">Evening Clutches</h3>
                            <p className="text-neutral-600 text-sm">Starting from $199</p>
                        </div>

                        <div className="group cursor-pointer">
                            <div className="aspect-square bg-neutral-100 mb-4 rounded-lg overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <h3 className="font-medium mb-2">Travel Accessories</h3>
                            <p className="text-neutral-600 text-sm">Starting from $149</p>
                        </div>
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
                            <button className="px-6 py-3 bg-black text-white font-medium hover:bg-neutral-800 transition-colors">
                                Discover Our Process
                            </button>
                        </div>
                        <div className="aspect-square bg-neutral-200 rounded-lg" />
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
                            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <button className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </section>
            </div>
        </SeniaLayout>
    );
}
