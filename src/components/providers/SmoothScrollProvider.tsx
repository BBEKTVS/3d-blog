'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
  lerp?: number;
  direction?: 'vertical' | 'horizontal';
  smoothWheel?: boolean;
  touchMultiplier?: number;
}

export function SmoothScrollProvider({
  children,
  lerp = 0.1,
  direction = 'vertical',
  smoothWheel = true,
  touchMultiplier = 2,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      lerp,
      direction,
      smoothWheel,
      touchMultiplier,
      infinite: false,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenisRef.current.on('scroll', ScrollTrigger.update);

    return () => {
      lenisRef.current?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [lerp, direction, smoothWheel, touchMultiplier]);

  return <>{children}</>;
}

interface UseScrollAnimationProps {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export function useScrollAnimation({
  trigger,
  start = 'top 80%',
  end = 'bottom 20%',
  scrub = 1,
  onEnter,
  onLeave,
  onEnterBack,
  onLeaveBack,
}: UseScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: trigger || el,
            start,
            end,
            scrub,
            onEnter,
            onLeave,
            onEnterBack,
            onLeaveBack,
            markers: false,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [trigger, start, end, scrub, onEnter, onLeave, onEnterBack, onLeaveBack]);

  return elementRef;
}

interface StaggeredScrollProps {
  children: ReactNode;
  stagger?: number;
  start?: string;
  className?: string;
}

export function StaggeredScroll({ children, stagger = 0.1, start = 'top 85%', className }: StaggeredScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current?.children;
      if (!items) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger,
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [stagger, start]);

  return <div ref={containerRef} className={className}>{children}</div>;
}

interface ParallaxScrollProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxScroll({ children, speed = 0.3, className }: ParallaxScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        yPercent: -50 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, elementRef);

    return () => ctx.revert();
  }, [speed]);

  return <div ref={elementRef} className={className}>{children}</div>;
}