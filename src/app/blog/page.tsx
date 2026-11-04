import { Metadata } from 'next';
import { BlogGrid } from '@/components/ui/BlogCard';
import { sanityClient } from '@/lib/sanity';
import { postsQuery } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore our collection of 3D web development tutorials, guides, and insights.',
};

async function getAllPosts() {
  return sanityClient.fetch(postsQuery);
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen">
      <header className="relative py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container-custom relative">
          <div className="max-w-3xl text-center mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              3D Web Development
            </span>
            <h1 className="heading-xl text-foreground mb-6 text-balance">
              Latest Articles
            </h1>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Deep dives into Three.js, React Three Fiber, WebGL, shaders, and creative coding techniques.
            </p>
          </div>
        </div>
      </header>

      <main className="container-custom pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="card p-6">
                <h3 className="heading-sm text-foreground mb-4">Categories</h3>
                <nav aria-label="Blog categories">
                  <ul className="space-y-2">
                    {[
                      { slug: 'all', label: 'All Posts', count: posts?.length || 0 },
                      { slug: '3d-design', label: '3D Design', count: 12 },
                      { slug: 'webgl', label: 'WebGL', count: 8 },
                      { slug: 'threejs', label: 'Three.js', count: 15 },
                      { slug: 'creative-coding', label: 'Creative Coding', count: 10 },
                      { slug: 'shaders', label: 'Shaders', count: 6 },
                      { slug: 'r3f', label: 'React Three Fiber', count: 18 },
                    ].map((cat) => (
                      <li key={cat.slug}>
                        <a
                          href={cat.slug === 'all' ? '/blog' : `/category/${cat.slug}`}
                          className="flex items-center justify-between py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <span>{cat.label}</span>
                          <span className="text-xs text-muted-foreground/70">{cat.count}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="card p-6">
                <h3 className="heading-sm text-foreground mb-4">Newsletter</h3>
                <p className="body-sm text-muted-foreground mb-4">
                  Get 3D insights delivered weekly.
                </p>
                <form className="flex flex-col gap-2" action="/api/newsletter" method="POST">
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className="input text-sm"
                    required
                  />
                  <button type="submit" className="btn-primary text-sm py-2">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>

          <section className="flex-1" aria-labelledby="posts-heading">
            <h2 id="posts-heading" className="sr-only">Blog Posts</h2>
            {posts && posts.length > 0 ? (
              <BlogGrid posts={posts} columns={2} />
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="heading-md text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground body">
                  Check back soon for amazing 3D content!
                </p>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <button className="btn-secondary" disabled>
                Load More
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}