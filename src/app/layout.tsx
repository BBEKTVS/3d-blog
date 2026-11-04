import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { getSettings } from '@/lib/sanity';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://3dblog.dev'),
  title: {
    default: '3D Blog - Immersive 3D Web Development',
    template: '%s | 3D Blog',
  },
  description: 'Explore the world of 3D web development with Three.js, WebGL, and creative coding tutorials.',
  keywords: ['3D', 'WebGL', 'Three.js', 'React Three Fiber', 'Creative Coding', 'Web Development'],
  authors: [{ name: '3D Blog' }],
  creator: '3D Blog',
  publisher: '3D Blog',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://3dblog.dev',
    siteName: '3D Blog',
    title: '3D Blog - Immersive 3D Web Development',
    description: 'Explore the world of 3D web development with Three.js, WebGL, and creative coding tutorials.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '3D Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Blog',
    description: 'Explore the world of 3D web development with Three.js, WebGL, and creative coding tutorials.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SmoothScrollProvider lerp={0.1}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Skip to main content
          </a>
          <Navigation
            links={settings?.navigation || [
              { label: 'Blog', href: '/blog' },
              { label: 'Categories', href: '/categories' },
              { label: 'About', href: '/about' },
            ]}
          />
          <main id="main-content" className="pt-16 lg:pt-20">
            {children}
          </main>
          <Footer
            socialLinks={settings?.socialLinks || []}
            navigation={settings?.navigation || []}
            footerText={settings?.footerText || 'Exploring the intersection of 3D graphics and web development.'}
            siteTitle={settings?.siteTitle || '3D Blog'}
          />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}