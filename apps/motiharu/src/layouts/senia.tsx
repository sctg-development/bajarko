import type React from "react";

import { Link } from "@heroui/link";
import { Trans } from "react-i18next";

import { Navbar } from "@/components/navbar";
import clutchbagHorizontal from "@/assets/clutchbag-horizontal.png";
import clutchbagVertical from "@/assets/clutchbag-vertical.png";

export default function SeniaLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="relative flex flex-col min-h-screen">
            {/* Navigation overlay on hero */}
            <div className="absolute top-0 left-0 right-0 z-20">
                <Navbar theme="dark" />
            </div>

            {/* Hero Section with full-width image */}
            <section className="relative w-full h-screen overflow-hidden">
                {/* Desktop Image */}
                <img
                    src={clutchbagHorizontal}
                    alt="Hero clutch bag"
                    className="hidden md:block w-full h-full object-cover object-center"
                />

                {/* Mobile Image */}
                <img
                    src={clutchbagVertical}
                    alt="Hero clutch bag"
                    className="block md:hidden w-full h-full object-cover object-center"
                />

                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
                    <div className="text-center px-6 max-w-4xl">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide mb-6">
                            Elegant Collection
                        </h1>
                        <p className="text-lg md:text-xl font-light opacity-90 mb-8 max-w-2xl">
                            Discover our curated selection of luxury accessories crafted with precision and style
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/collections"
                                className="px-8 py-3 bg-white text-black font-medium hover:bg-opacity-90 transition-all duration-300"
                            >
                                Shop Collection
                            </Link>
                            <Link
                                href="/about"
                                className="px-8 py-3 border border-white text-white font-medium hover:bg-white hover:text-black transition-all duration-300"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="container mx-auto max-w-7xl px-6 py-16">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-neutral-50 border-t">
                <div className="container mx-auto max-w-7xl px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-xl font-semibold mb-4">SCTG Development</h3>
                            <p className="text-neutral-600 mb-4 max-w-md">
                                Creating exceptional digital experiences with modern design and cutting-edge technology.
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    isExternal
                                    href="https://heroui.com"
                                    className="text-neutral-600 hover:text-primary transition-colors"
                                >
                                    <Trans ns="base">powered-by</Trans> HeroUI
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-medium mb-4">Quick Links</h4>
                            <div className="space-y-2">
                                <Link href="/" className="block text-neutral-600 hover:text-neutral-900 transition-colors">
                                    Home
                                </Link>
                                <Link href="/about" className="block text-neutral-600 hover:text-neutral-900 transition-colors">
                                    About
                                </Link>
                                <Link href="/collections" className="block text-neutral-600 hover:text-neutral-900 transition-colors">
                                    Collections
                                </Link>
                                <Link href="/contact" className="block text-neutral-600 hover:text-neutral-900 transition-colors">
                                    Contact
                                </Link>
                            </div>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-medium mb-4">Support</h4>
                            <div className="space-y-2">
                                <Link href="/help" className="block text-neutral-600 hover:text-neutral-900 transition-colors">
                                    Help Center
                                </Link>
                                <Link href="/shipping" className="block text-neutral-600 hover:text-neutral-900 transition-colors">
                                    Shipping Info
                                </Link>
                                <Link href="/returns" className="block text-neutral-600 hover:text-neutral-900 transition-colors">
                                    Returns
                                </Link>
                                <Link href="/privacy" className="block text-neutral-600 hover:text-neutral-900 transition-colors">
                                    Privacy Policy
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-neutral-600 text-sm">
                            © 2025 SCTG Development. All rights reserved.
                        </p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="/terms" className="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/privacy" className="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
