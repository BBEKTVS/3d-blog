'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars, Environment, ContactShadows, AccumulativeShadows } from '@react-three/drei';
import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ProceduralHeroProps {
  title: string;
  subtitle: string;
  className?: string;
  onScrollProgress?: (progress: number) => void;
}

function ProceduralScene({
  title,
  subtitle,
  scrollProgress,
  setScrollProgress,
}: {
  title: string;
  subtitle: string;
  scrollProgress: MotionValue<number>;
  setScrollProgress: (v: number) => void;
}) {
  const { camera, scene, gl } = useThree();
  const starsRef = useRef<THREE.Points | null>(null);
  const torusKnotRef = useRef<THREE.Mesh | null>(null);
  const icosahedronRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const progress = scrollProgress.current;

    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.001;
    }

    if (torusKnotRef.current) {
      torusKnotRef.current.rotation.x = time * 0.15 + progress * Math.PI;
      torusKnotRef.current.rotation.y = time * 0.1 + progress * Math.PI * 0.5;
      torusKnotRef.current.position.y = Math.sin(time * 0.5) * 0.3;
      torusKnotRef.current.position.z = -progress * 5;
    }

    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.x = time * -0.1 + progress * Math.PI * 0.3;
      icosahedronRef.current.rotation.y = time * 0.05;
      icosahedronRef.current.position.y = -1.5 + Math.cos(time * 0.7) * 0.2;
      icosahedronRef.current.position.z = -progress * 3;
      icosahedronRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.002;
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 2 + i) * 0.0005;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (camera) {
      camera.position.z = 8 + progress * 12;
      camera.position.y = progress * 1.5;
      camera.lookAt(0, -0.5, -progress * 5);
    }
  });

  useEffect(() => {
    const unsubscribe = scrollProgress.onChange((v) => setScrollProgress(v));
    return unsubscribe;
  }, [scrollProgress, setScrollProgress]);

  const torusKnotGeometry = useMemo(() => new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16), []);
  const icosahedronGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.8, 8), []);
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, []);

  return (
    <>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 5, 60]} />

      <Stars ref={starsRef} radius={200} depth={100} opacity={0.8} factor={4} saturation={0} color="#ffffff" />

      <Environment
        preset="city"
        background={false}
        resolution={256}
      />

      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      <group>
        <mesh
          ref={torusKnotRef}
          geometry={torusKnotGeometry}
          position={[0, 0.5, 0]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color="#00d4ff"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.3}
            thickness={0.5}
            ior={1.5}
            envMapIntensity={2}
          />
        </mesh>

        <mesh
          ref={icosahedronRef}
          geometry={icosahedronGeometry}
          position={[-3, -1.5, -2]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color="#ff6b00"
            metalness={0.3}
            roughness={0.4}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
            envMapIntensity={1.5}
            emissive="#ff6b00"
            emissiveIntensity={0.2}
          />
        </mesh>

        <mesh
          geometry={icosahedronGeometry}
          position={[3, -1.5, -2]}
          castShadow
          receiveShadow
          scale={0.6}
        >
          <meshPhysicalMaterial
            color="#00ff88"
            metalness={0.7}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            wireframe={true}
          />
        </mesh>
      </group>

      <AccumulativeShadows
        temporal
        color="#000000"
        opacity={0.4}
        scale={20}
        frames={100}
        position={[0, -3, 0]}
      >
        <ContactShadows
          position={[0, -3.2, 0]}
          opacity={0.5}
          scale={30}
          blur={3}
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
          <h1 className="heading-xl lg:heading-2xl font-display text-white mb-6 leading-tight text-balance">
            {title}
          </h1>
          <p className="body-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            {subtitle}
          </p>
        </div>
      </Html>
    </>
  );
}

export function ProceduralHero({
  title = '3D Blog',
  subtitle = 'Immersive 3D Web Development',
  className,
  onScrollProgress,
}: ProceduralHeroProps) {
  const scrollProgress = useScroll({
    target: undefined,
    offset: ['start start', 'end start'],
  });

  const progress = useTransform(scrollProgress, [0, 1], [0, 1]);

  return (
    <div className={cn('relative w-full h-screen lg:h-[100vh]', className)}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        shadows={true}
        className="w-full h-full"
      >
        <Suspense fallback={<SceneLoading />}>
          <ProceduralScene
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