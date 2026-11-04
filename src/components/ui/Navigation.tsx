'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/components/providers/SmoothScrollProvider';

interface NavigationProps {
  links: { label: string; href: string }[];
  logo?: React.ReactNode;
  className?: string;
}

export function Navigation({ links, logo, className }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLNavElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useScrollAnimation({
    trigger: navRef,
    start: 'top top',
    end: 'bottom top',
    scrub: 0,
    onEnter: () => setScrolled(true),
    onLeaveBack: () => setScrolled(false),
  });

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-[0_10px_40px_hsl(var(--primary)/0.05)]'
          : 'bg-transparent',
        className
      )}
    >
      <div className="container-custom">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-10" aria-label="Home">
            {logo || (
              <span className="font-display text-xl font-bold text-foreground">
                3D<span className="text-primary">Blog</span>
              </span>
            )}
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-medium transition-colors duration-200 hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-primary animate-scale-in" />
                )}
              </Link>
            ))}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors z-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
          )}
        >
          <div className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}