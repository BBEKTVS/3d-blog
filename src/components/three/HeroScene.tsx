'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars, Environment, ContactShadows, useFBO, AccumulativeShadows } from '@react-three/drei';
import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useEffect, useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { HeroModel } from './ModelLoader';
import { cn } from '@/lib/utils';

interface HeroSceneProps {
  modelUrl: string;
  title: string;
  subtitle: string;
  className?: string;
  onScrollProgress?: (progress: number) => void;
}

function SceneContent({
  modelUrl,
  title,
  subtitle,
  scrollProgress,
  setScrollProgress,
}: {
  modelUrl: string;
  title: string;
  subtitle: string;
  scrollProgress: MotionValue<number>;
  setScrollProgress: (v: number) => void;
}) {
  const { camera, scene, gl } = useThree();
  const starsRef = useRef<THREE.Points | null>(null);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.002;
      starsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.001) * 0.02;
    }

    if (camera) {
      camera.position.z = 5 + scrollProgress.current * 10;
      camera.position.y = scrollProgress.current * 2;
      camera.lookAt(0, 0, 0);
    }
  });

  useEffect(() => {
    const unsubscribe = scrollProgress.onChange((v) => setScrollProgress(v));
    return unsubscribe;
  }, [scrollProgress, setScrollProgress]);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 1, 50]} />

      <Stars ref={starsRef} radius={100} depth={100} opacity={0.6} factor={4} saturation={0} color="#ffffff" />

      <Environment
        preset="city"
        background={false}
        resolution={256}
        files={['/hdri/px.png', '/hdri/nx.png', '/hdri/py.png', '/hdri/ny.png', '/hdri/pz.png', '/hdri/nz.png']}
      />

      <HeroModel
        url={modelUrl}
        scrollProgress={scrollProgress.current}
        config={{
          initialPosition: [0, 0, 0],
          finalPosition: [0, -3, -10],
          initialRotation: [0, 0, 0],
          finalRotation: [0.3, Math.PI * 0.5, 0],
          initialScale: 1.2,
          finalScale: 0.8,
          floatAmount: 0.5,
          floatSpeed: 0.3,
        }}
      />

      <AccumulativeShadows
        temporal
        color="#000000"
        opacity={0.3}
        scale={10}
        frames={100}
        position={[0, -2, 0]}
      >
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={20}
          blur={2}
          color="#000000"
        />
      </AccumulativeShadows>

      <Html
        transform
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '800px',
          padding: '0 2rem',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <h1 className="heading-xl font-display text-white mb-6 leading-tight text-balance">
            {title}
          </h1>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            {subtitle}
          </p>
        </div>
      </Html>
    </>
  );
}

export function HeroScene({
  modelUrl = '/models/hero.glb',
  title = 'Welcome to the Future',
  subtitle = 'Experience immersive 3D storytelling with smooth parallax effects',
  className,
  onScrollProgress,
}: HeroSceneProps) {
  const scrollProgress = useScroll({
    target: undefined,
    offset: ['start start', 'end start'],
  });

  const progress = useTransform(scrollProgress, [0, 1], [0, 1]);

  return (
    <div className={cn('relative w-full h-screen lg:h-[100vh]', className)}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        shadows={true}
        className="w-full h-full"
      >
        <Suspense fallback={<SceneLoading />}>
          <SceneContent
            modelUrl={modelUrl}
            title={title}
            subtitle={subtitle}
            scrollProgress={progress}
            setScrollProgress={onScrollProgress ?? (() => {})}
          />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/10 to-background/90 pointer-events-none" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDuration: '2s' }}>
        <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}

function SceneLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading 3D scene...</p>
      </div>
    </div>
  );
}

interface ParallaxLayersProps {
  children: React.ReactNode;
  speed?: number;
}

export function ParallaxLayers({ children, speed = 0.5 }: ParallaxLayersProps) {
  const { scrollYProgress } = useScroll({
    target: undefined,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -300 * speed]);

  return (
    <motion.div style={{ y, willChange: 'transform' }} className="will-change-transform">
      {children}
    </motion.div>
  );
}

interface ScrollIndicatorProps {
  scrollProgress: number;
}

export function ScrollIndicator({ scrollProgress }: ScrollIndicatorProps) {
  return (
    <div
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center"
      style={{
        maskImage: `conic-gradient(from -90deg, transparent ${scrollProgress * 360}deg, white ${scrollProgress * 360}deg)`,
        WebkitMaskImage: `conic-gradient(from -90deg, transparent ${scrollProgress * 360}deg, white ${scrollProgress * 360}deg)`,
      }}
    >
      <span className="text-xs text-primary font-mono">{Math.round(scrollProgress * 100)}%</span>
    </div>
  );
}