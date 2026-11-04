import { HeroScene } from '@/components/three/HeroScene';
import { BlogGrid } from '@/components/ui/BlogCard';
import { BlogCard } from '@/components/ui/BlogCard';
import { getSettings } from '@/lib/sanity';
import { sanityClient } from '@/lib/sanity';
import { featuredPostsQuery, postsQuery } from '@/lib/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Explore the world of 3D web development with Three.js, WebGL, and creative coding tutorials.',
};

async function getFeaturedPosts() {
  return sanityClient.fetch(featuredPostsQuery);
}

async function getLatestPosts() {
  const posts = await sanityClient.fetch(postsQuery);
  return posts.slice(0, 6);
}

export default async function HomePage() {
  const [settings, featuredPosts, latestPosts] = await Promise.all([
    getSettings(),
    getFeaturedPosts(),
    getLatestPosts(),
  ]);

  const siteTitle = settings?.siteTitle || '3D Blog';
  const siteDescription = settings?.siteDescription || 'Explore the world of 3D web development';

  return (
    <div className="min-h-screen">
      <HeroScene
        modelUrl="/models/hero.glb"
        title={siteTitle}
        subtitle={siteDescription}
      />

      {featuredPosts && featuredPosts.length > 0 && (
        <section className="section container-custom" aria-labelledby="featured-heading">
          <div className="flex items-end justify-between gap-4 mb-12">
            <div>
              <h2 id="featured-heading" className="heading-lg text-foreground mb-2">
                Featured Articles
              </h2>
              <p className="body text-muted-foreground">
                Hand-picked deep dives into 3D web development
              </p>
            </div>
            <a
              href="/blog"
              className="btn-secondary whitespace-nowrap hidden sm:inline-flex"
            >
              View All
            </a>
          </div>

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {featuredPosts.map((post: any, index: number) => (
              <BlogCard
                key={post._id}
                post={post}
                variant="featured"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              />
            ))}
          </div>
        </section>
      )}

      <section className="section container-custom" aria-labelledby="latest-heading">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <h2 id="latest-heading" className="heading-lg text-foreground mb-2">
              Latest Articles
            </h2>
            <p className="body text-muted-foreground">
              Fresh content from the world of 3D web development
            </p>
          </div>
          <a
            href="/blog"
            className="btn-secondary whitespace-nowrap hidden sm:inline-flex"
          >
            View All
          </a>
        </div>

        <BlogGrid posts={latestPosts || []} columns={3} />
      </section>

      <section className="section bg-muted/30" aria-labelledby="cta-heading">
        <div className="container-custom">
          <div className="card max-w-3xl mx-auto text-center p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
            <h2 id="cta-heading" className="heading-lg text-foreground mb-4 relative z-10">
              Stay Updated with 3D Insights
            </h2>
            <p className="body-lg text-muted-foreground mb-8 relative z-10 max-w-md mx-auto">
              Get the latest tutorials, techniques, and inspiration delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input flex-1"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground relative z-10">
              No spam, unsubscribe anytime. <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}