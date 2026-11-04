# 3D Blog - High-End 3D Web Development Blog

A production-ready, high-performance blog built with Next.js 14, React Three Fiber, and Sanity CMS. Features immersive 3D hero scenes, smooth parallax scrolling, and stunning visual effects.

## ✨ Features

- **🎯 3D Hero Scene** - Interactive Three.js hero with scroll-based parallax effects
- **📱 Smooth Scrolling** - Lenis + GSAP ScrollTrigger for buttery-smooth animations
- **🎨 Custom 3D Models** - Load .glb/.gltf models with Suspense boundaries and fallbacks
- **📝 Sanity CMS** - Headless CMS with real-time preview and portable text
- **⚡ Performance Optimized** - Lazy loading, image optimization, code splitting
- **🎭 Staggered Animations** - GSAP-powered scroll reveal animations
- **🌙 Dark/Light Mode** - CSS variable-based theming with Tailwind
- **♿ Accessible** - Semantic HTML, ARIA labels, focus management
- **🔍 SEO Ready** - Open Graph, Twitter Cards, structured data

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **3D**: React Three Fiber + @react-three/drei + @react-three/postprocessing
- **Animation**: GSAP + ScrollTrigger + Lenis (smooth scroll)
- **Styling**: Tailwind CSS + CSS Variables
- **CMS**: Sanity.io (Headless)
- **Content**: Portable Text + Custom components
- **Deployment**: Vercel (recommended)

## 📦 Project Structure

```
3d-blog/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage with 3D Hero
│   │   ├── blog/
│   │   │   ├── page.tsx       # Blog index
│   │   │   └── [slug]/page.tsx # Individual post
│   │   ├── category/[slug]/page.tsx # Category pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── globals.css        # Global styles + CSS variables
│   ├── components/
│   │   ├── three/             # 3D components
│   │   │   ├── ModelLoader.tsx    # GLTF loader with Suspense
│   │   │   └── HeroScene.tsx      # 3D Hero with parallax
│   │   ├── ui/                # UI components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── BlogCard.tsx       # Post cards (3 variants)
│   │   │   └── PortableText.tsx   # Sanity block content renderer
│   │   └── providers/         # Context providers
│   │       └── SmoothScrollProvider.tsx # Lenis + GSAP
│   ├── lib/
│   │   ├── sanity.ts          # Sanity client + image builder
│   │   ├── queries.ts         # GROQ queries
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── sanity.ts          # TypeScript types
├── sanity/
│   ├── schemas/               # Sanity schema types
│   │   ├── post.ts
│   │   ├── author.ts
│   │   ├── category.ts
│   │   └── settings.ts
│   └── sanity.config.ts       # Sanity Studio config
├── public/
│   └── models/                # 3D models (.glb files)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn
- Sanity.io account (for CMS)

### Installation

```bash
# Clone and install dependencies
cd 3d-blog
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your Sanity credentials in .env.local
```

### Environment Variables

```env
# Sanity CMS (Required)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_api_token

# Optional
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-studio.sanity.studio
```

### Development

```bash
# Start Next.js dev server
npm run dev

# In another terminal, start Sanity Studio
npm run sanity:dev
```

Visit `http://localhost:3000` for the blog and `http://localhost:3333` for Sanity Studio.

## 🎨 3D Models

Place your `.glb` models in `public/models/`. The hero scene expects `/models/hero.glb` by default.

### Model Requirements

- Format: `.glb` or `.gltf`
- Optimized: Use [gltf-transform](https://gltf-transform.dev/) or [gltfpack](https://github.com/zeux/meshoptimizer#gltfpack)
- Size: Aim for < 2MB for hero models
- Textures: Embedded or external (configure in `next.config.mjs`)

### Customizing the Hero Model

```tsx
// src/app/page.tsx
<HeroScene
  modelUrl="/models/your-model.glb"
  title="Your Title"
  subtitle="Your subtitle"
/>
```

### Model Loader Props

```tsx
<ModelLoader
  url="/models/model.glb"
  position={[0, 0, 0]}
  rotation={[0, 0, 0]}
  scale={1}
  receiveShadow={true}
  castShadow={true}
  onLoad={(gltf) => { /* custom setup */ }}
/>
```

## 📝 Sanity Studio Setup

### Schema Types

1. **Post** - Blog articles with portable text, images, code blocks
2. **Author** - Writer profiles with social links
3. **Category** - Topics with color/icon for UI
4. **Settings** - Site-wide config (title, navigation, footer)

### Deploying Studio

```bash
npm run sanity:deploy
```

## 🎯 Customization

### Theming

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --background: 222 47% 4%;
  --foreground: 210 40% 98%;
  --primary: 199 89% 48%;
  /* ... more variables */
}

.light {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  /* ... light mode overrides */
}
```

### Animation Configuration

Modify `SmoothScrollProvider` props in `src/app/layout.tsx`:

```tsx
<SmoothScrollProvider
  lerp={0.1}           // Scroll smoothness (0-1)
  direction="vertical" // or "horizontal"
  smoothWheel={true}
  touchMultiplier={2}
/>
```

## 📊 Performance

### Built-in Optimizations

- **Image Optimization**: Next.js Image with AVIF/WebP
- **Code Splitting**: Automatic per-route
- **Font Optimization**: `next/font` with self-hosting
- **3D Model Lazy Loading**: Suspense boundaries
- **Bundle Analysis**: `ANALYZE=true npm run build`

### Lighthouse Targets

- Performance: > 90
- Accessibility: 100
- Best Practices: > 90
- SEO: 100

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a PR

## 🙏 Acknowledgments

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [Drei](https://github.com/pmndrs/drei) - Useful helpers for R3F
- [GSAP](https://greensock.com/gsap/) - Professional animation
- [Lenis](https://github.com/studio-freight/lenis) - Smooth scroll
- [Sanity](https://www.sanity.io/) - Headless CMS
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS