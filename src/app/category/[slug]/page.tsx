import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogGrid } from '@/components/ui/BlogCard';
import { sanityClient } from '@/lib/sanity';
import { categoryQuery, categoriesQuery } from '@/lib/queries';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await sanityClient.fetch(categoriesQuery);
  return categories.map((cat: any) => ({ slug: cat.slug.current }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityClient.fetch(categoryQuery, { slug });

  if (!category) return { title: 'Category Not Found' };

  return {
    title: category.title,
    description: category.description || `Browse all articles about ${category.title}`,
    openGraph: {
      title: category.title,
      description: category.description || `Browse all articles about ${category.title}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await sanityClient.fetch(categoryQuery, { slug });

  if (!category) notFound();

  return (
    <div className="min-h-screen">
      <header className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
        {category.color && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[${category.color}]/10 via-transparent to-transparent" />
        )}
        <div className="container-custom relative">
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span aria-current="page">{category.title}</span>
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            {category.icon && (
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{
                  backgroundColor: `${category.color}15`,
                  borderColor: `${category.color}80`,
                  color: category.color,
                }}
              >
                {category.icon} {category.title}
              </span>
            )}

            <h1 className="heading-xl lg:heading-2xl text-foreground mb-6 text-balance">
              {category.title}
            </h1>

            {category.description && (
              <p className="body-lg text-muted-foreground max-w-2xl text-balance">
                {category.description}
              </p>
            )}

            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{category.postCount || 0} articles</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="card p-6">
                <h3 className="heading-sm text-foreground mb-4">All Categories</h3>
                <nav aria-label="All categories">
                  <ul className="space-y-2">
                    <li>
                      <Link href="/blog" className="flex items-center justify-between py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                        <span>All Posts</span>
                      </Link>
                    </li>
                    {[
                      { slug: '3d-design', label: '3D Design', color: '#8b5cf6' },
                      { slug: 'webgl', label: 'WebGL', color: '#06b6d4' },
                      { slug: 'threejs', label: 'Three.js', color: '#f59e0b' },
                      { slug: 'creative-coding', label: 'Creative Coding', color: '#ec4899' },
                      { slug: 'shaders', label: 'Shaders', color: '#10b981' },
                      { slug: 'r3f', label: 'React Three Fiber', color: '#ef4444' },
                    ].map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/category/${cat.slug}`}
                          className="flex items-center justify-between py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          style={cat.slug === slug ? { color: cat.color, backgroundColor: `${cat.color}15` } : {}}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                            {cat.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </aside>

          <section className="flex-1" aria-labelledby="posts-heading">
            <h2 id="posts-heading" className="sr-only">{category.title} Posts</h2>
            {category.posts && category.posts.length > 0 ? (
              <BlogGrid posts={category.posts} columns={2} />
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="heading-md text-foreground mb-2">No articles in this category yet</h3>
                <p className="text-muted-foreground body">
                  Check back soon for content about {category.title.toLowerCase()}!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}