# 3D Models Directory

Place your `.glb` or `.gltf` models in this directory.

## Required Models

- `hero.glb` - Main hero scene model (used on homepage)
- `post-placeholder.glb` - Fallback model for blog posts

## Recommended Specifications

### Hero Model
- Format: `.glb` (binary GLTF)
- Size: < 2MB (compressed with gltfpack)
- Polygons: < 50k triangles
- Textures: Embedded or compressed (KTX2/BasisU)
- Centered at origin (0, 0, 0)
- Scale: ~1-2 units

### Optimization Commands

```bash
# Install gltf-transform
npm install -g @gltf-transform/cli

# Compress textures and optimize
gltf-transform compress hero.glb hero-compressed.glb \
  --texture-compress=webp \
  --texture-resize=1024 \
  --weld \
  --prune \
  --dedup

# Or use gltfpack (more aggressive)
gltfpack -i hero.glb -o hero-packed.glb -cc -kn -tc
```

## Model Structure Tips

1. **Naming**: Use descriptive names for meshes/materials
2. **Pivot**: Center geometry at origin
3. **Units**: Use meters (1 unit = 1 meter)
4. **Up Axis**: Y-up (Three.js standard)

## Loading in Components

```tsx
import { HeroScene } from '@/components/three';

// With custom model
<HeroScene modelUrl="/models/your-model.glb" />

// Or use the ModelLoader directly
import { ModelLoader } from '@/components/three';

<ModelLoader
  url="/models/your-model.glb"
  position={[0, 0, 0]}
  scale={1}
  onLoad={(gltf) => {
    // Custom setup (animations, materials, etc.)
  }}
/>
```

## Fallback

If no model is provided, the `ProceduralHero` component will be used automatically, generating a beautiful 3D scene with code.