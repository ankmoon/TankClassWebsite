import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "SEO" });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tankmentor.com";
    
    return {
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: "/",
            languages: {
                "vi-VN": "/vi",
                "en-US": "/en",
            },
        },
        openGraph: {
            type: "website",
            siteName: "TankMentor",
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "TankMentor - BA & PM Career Mentor",
                }
            ],
        },
        twitter: {
            card: "summary_large_image",
            creator: "@tankmentor",
        },
    };
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased selection:bg-accent/20 selection:text-primary" suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <Navbar />
                    {children}
                    <Footer />
                </NextIntlClientProvider>
                <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} />
            </body>
        </html>
    );
}
