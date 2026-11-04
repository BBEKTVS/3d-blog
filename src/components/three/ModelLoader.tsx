'use client';

import { Suspense, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ModelLoaderProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  className?: string;
  onLoad?: (gltf: any) => void;
  receiveShadow?: boolean;
  castShadow?: boolean;
}

export function ModelLoader({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  className,
  onLoad,
  receiveShadow = true,
  castShadow = true,
}: ModelLoaderProps) {
  const gltf = useGLTF(url, (gltf) => {
    if (onLoad) onLoad(gltf);
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
      }
    });
  });

  const scaleArray = useMemo(() =>
    Array.isArray(scale) ? scale : [scale, scale, scale], [scale]);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scaleArray}
      className={className}
    >
      <primitive object={gltf.scene} dispose={null} />
    </group>
  );
}

function ModelFallback() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a2e" wireframe />
      </mesh>
    </group>
  );
}

interface ScrollParallaxModelProps extends ModelLoaderProps {
  scrollRange?: [number, number];
  parallaxIntensity?: number;
  rotateOnScroll?: boolean;
}

export function ScrollParallaxModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  scrollRange = [0, 1],
  parallaxIntensity = 1,
  rotateOnScroll = false,
  ...props
}: ScrollParallaxModelProps) {
  const { scrollYProgress } = useScroll({
    target: undefined,
    offset: [`${scrollRange[0] * 100}%`, `${scrollRange[1] * 100}%`],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-parallaxIntensity, parallaxIntensity]);
  const rotY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.5]);

  return (
    <group
      position={[position[0], position[1] + y.current, position[2]]}
      rotation={rotateOnScroll ? [rotation[0], rotation[1] + rotY.current, rotation[2]] : rotation}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    >
      <Suspense fallback={<ModelFallback />}>
        <ModelLoader url={url} {...props} />
      </Suspense>
    </group>
  );
}

interface FloatingModelProps extends ModelLoaderProps {
  floatIntensity?: number;
  floatSpeed?: number;
  rotateSpeed?: number;
}

export function FloatingModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  floatIntensity = 0.5,
  floatSpeed = 1,
  rotateSpeed = 0.2,
  ...props
}: FloatingModelProps) {
  const { clock } = useThree();
  const groupRef = useMemo(() => ({ current: null }), []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * floatSpeed) * floatIntensity;
      groupRef.current.rotation.y = rotation[1] + clock.getElapsedTime() * rotateSpeed;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={Array.isArray(scale) ? scale : [scale, scale, scale]}>
      <Suspense fallback={<ModelFallback />}>
        <ModelLoader url={url} {...props} />
      </Suspense>
    </group>
  );
}

interface HeroModelProps {
  url: string;
  scrollProgress: number;
  config?: {
    initialPosition?: [number, number, number];
    finalPosition?: [number, number, number];
    initialRotation?: [number, number, number];
    finalRotation?: [number, number, number];
    initialScale?: number;
    finalScale?: number;
    floatAmount?: number;
    floatSpeed?: number;
  };
}

export function HeroModel({
  url,
  scrollProgress,
  config = {},
}: HeroModelProps) {
  const {
    initialPosition = [0, 0, 0],
    finalPosition = [0, 0, 0],
    initialRotation = [0, 0, 0],
    finalRotation = [0, Math.PI * 2, 0],
    initialScale = 1,
    finalScale = 1,
    floatAmount = 0.3,
    floatSpeed = 0.5,
  } = config;

  const { clock } = useThree();

  const position = [
    initialPosition[0] + (finalPosition[0] - initialPosition[0]) * scrollProgress,
    initialPosition[1] + (finalPosition[1] - initialPosition[1]) * scrollProgress + Math.sin(clock.getElapsedTime() * floatSpeed) * floatAmount,
    initialPosition[2] + (finalPosition[2] - initialPosition[2]) * scrollProgress,
  ];

  const rotation = [
    initialRotation[0] + (finalRotation[0] - initialRotation[0]) * scrollProgress,
    initialRotation[1] + (finalRotation[1] - initialRotation[1]) * scrollProgress,
    initialRotation[2] + (finalRotation[2] - initialRotation[2]) * scrollProgress,
  ];

  const scale = initialScale + (finalScale - initialScale) * scrollProgress;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Suspense fallback={<ModelFallback />}>
        <ModelLoader url={url} />
      </Suspense>
    </group>
  );
}