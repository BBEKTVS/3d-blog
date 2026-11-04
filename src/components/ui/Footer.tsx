'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/components/providers/SmoothScrollProvider';

interface FooterProps {
  socialLinks: { platform: string; url: string }[];
  navigation: { label: string; href: string }[];
  footerText: string;
  siteTitle: string;
  className?: string;
}

export function Footer({
  socialLinks,
  navigation,
  footerText,
  siteTitle,
  className,
}: FooterProps) {
  const footerRef = useScrollAnimation({ start: 'top 90%' });

  return (
    <footer ref={footerRef} className={cn('border-t border-border bg-muted/30 backdrop-blur-sm', className)}>
      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6" aria-label={`${siteTitle} homepage`}>
              <span className="font-display text-2xl font-bold text-foreground">
                3D<span className="text-primary">Blog</span>
              </span>
            </Link>
            <p className="text-muted-foreground body-sm max-w-xs mb-6 leading-relaxed">
              {footerText}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Main navigation">
            <h3 className="heading-sm text-foreground mb-6">Navigate</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors body-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Categories">
            <h3 className="heading-sm text-foreground mb-6">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/category/3d-design" className="text-muted-foreground hover:text-primary transition-colors body-sm">3D Design</Link></li>
              <li><Link href="/category/webgl" className="text-muted-foreground hover:text-primary transition-colors body-sm">WebGL</Link></li>
              <li><Link href="/category/threejs" className="text-muted-foreground hover:text-primary transition-colors body-sm">Three.js</Link></li>
              <li><Link href="/category/creative-coding" className="text-muted-foreground hover:text-primary transition-colors body-sm">Creative Coding</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="heading-sm text-foreground mb-6">Newsletter</h3>
            <p className="text-muted-foreground body-sm mb-4">
              Get the latest 3D web development insights delivered to your inbox.
            </p>
            <form className="flex gap-2" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input flex-1 text-sm"
                required
              />
              <button type="submit" className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground body-sm text-center md:text-left">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/rss.xml" className="hover:text-primary transition-colors">RSS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function getSocialIcon(platform: string) {
  const icons: Record<string, React.ReactNode> = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  };
  return icons[platform.toLowerCase()] || icons.twitter;
}