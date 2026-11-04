import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableTextRenderer } from '@/components/ui/PortableText';
import { BlogCard, BlogGrid } from '@/components/ui/BlogCard';
import { sanityClient } from '@/lib/sanity';
import { postQuery, postSlugsQuery, relatedPostsQuery } from '@/lib/queries';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { formatDate, getReadingTime } from '@/lib/utils';
import { Post, Category } from '@/types/sanity';
import Link from 'next/link';
import { useScrollAnimation } from '@/components/providers/SmoothScrollProvider';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(postSlugsQuery);
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch(postQuery, { slug });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.name || '3D Blog'],
      tags: post.tags,
      images: post.seo?.ogImage || post.mainImage
        ? [{ url: urlFor(post.seo?.ogImage || post.mainImage!).width(1200).height(630).fit('crop').url() }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      images: post.seo?.ogImage || post.mainImage
        ? [urlFor(post.seo?.ogImage || post.mainImage!).width(1200).height(630).fit('crop').url()]
        : [],
    },
    other: {
      'article:published_time': post.publishedAt,
      'article:author': post.author?.name || '3D Blog',
      'article:section': post.categories?.[0]?.title || 'General',
      'article:tag': post.tags?.join(',') || '',
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await sanityClient.fetch(postQuery, { slug });

  if (!post) notFound();

  const readingTime = post.readingTime || getReadingTime(post.excerpt);
  const categoryIds = post.categories?.map((c: Category) => c._id) || [];
  const relatedPosts = categoryIds.length > 0
    ? await sanityClient.fetch(relatedPostsQuery, { id: post._id, categoryIds })
    : [];

  return (
    <article className="min-h-screen">
      <header className="relative py-20 lg:py-32 overflow-hidden">
        {post.mainImage && (
          <div className="absolute inset-0 -z-10">
            <Image
              src={urlFor(post.mainImage).width(1920).height(1080).fit('crop').url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          </div>
        )}

        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {post.categories?.slice(0, 3).map((cat: Category) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug.current}`}
                  className="px-3 py-1 text-sm font-medium rounded-full border transition-colors"
                  style={{
                    borderColor: cat.color ? `${cat.color}80` : 'hsl(var(--border))',
                    backgroundColor: cat.color ? `${cat.color}15` : 'hsl(var(--accent))',
                    color: cat.color || 'hsl(var(--foreground))',
                  }}
                >
                  {cat.title}
                </Link>
              ))}
            </div>

            <h1 className="heading-xl lg:heading-2xl text-foreground mb-6 text-balance leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
              {post.author?.image && (
                <Link href={`/author/${post.author.slug.current}`} className="flex items-center gap-3 group">
                  <Image
                    src={urlFor(post.author.image).width(48).height(48).url()}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full border border-border group-hover:border-primary/50 transition-colors"
                  />
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {post.author.name}
                  </span>
                </Link>
              )}

              <div className="flex items-center gap-4 text-sm">
                <time dateTime={post.publishedAt} className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(post.publishedAt, 'long')}
                </time>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readingTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1 lg:pr-8">
            <div className="prose prose-invert max-w-none">
              <PortableTextRenderer blocks={post.content} />
            </div>

            {post.tags && post.tags.length > 0 && (
              <footer className="mt-16 pt-8 border-t border-border">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                  {post.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 text-sm rounded-full border border-border hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                {post.author && (
                  <div className="mt-8 p-6 card flex gap-4">
                    {post.author.image && (
                      <Link href={`/author/${post.author.slug.current}`} className="flex-shrink-0">
                        <Image
                          src={urlFor(post.author.image).width(80).height(80).url()}
                          alt={post.author.name}
                          width={80}
                          height={80}
                          className="rounded-full border border-border"
                        />
                      </Link>
                    )}
                    <div className="flex-1">
                      <Link href={`/author/${post.author.slug.current}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                        {post.author.name}
                      </Link>
                      {post.author.bio && (
                        <PortableTextRenderer blocks={post.author.bio} className="mt-2 text-sm text-muted-foreground" />
                      )}
                    </div>
                  </div>
                )}
              </footer>
            )}

            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-16" aria-labelledby="related-heading">
                <h2 id="related-heading" className="heading-lg text-foreground mb-8">
                  Related Articles
                </h2>
                <BlogGrid posts={relatedPosts} columns={2} variant="compact" />
              </section>
            )}
          </div>

          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <nav className="card p-6" aria-label="Table of contents">
                <h3 className="heading-sm text-foreground mb-4">Contents</h3>
                <TableOfContents content={post.content} />
              </nav>

              <div className="card p-6">
                <h3 className="heading-sm text-foreground mb-4">Share this article</h3>
                <div className="flex gap-3">
                  {[
                    { platform: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://3dblog.dev/blog/${post.slug.current}`)}`, icon: 'twitter' },
                    { platform: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://3dblog.dev/blog/${post.slug.current}`)}`, icon: 'linkedin' },
                    { platform: 'Copy Link', url: '#', icon: 'link', copy: true },
                  ].map((share) => (
                    <button
                      key={share.platform}
                      onClick={(e) => {
                        if (share.copy) {
                          e.preventDefault();
                          navigator.clipboard.writeText(`https://3dblog.dev/blog/${post.slug.current}`);
                        } else {
                          window.open(share.url, '_blank', 'width=600,height=400');
                        }
                      }}
                      className="flex-1 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-colors flex items-center justify-center gap-2"
                      aria-label={`Share on ${share.platform}`}
                    >
                      {getShareIcon(share.icon)}
                      <span className="text-sm font-medium">{share.platform}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </article>
  );
}

function TableOfContents({ content }: { content: any[] }) {
  const headings = content
    ?.filter((block) => block._type === 'block' && block.style?.startsWith('h'))
    .map((block) => ({
      level: parseInt(block.style.charAt(1)),
      text: block.children?.map((c: any) => c.text).join('') || '',
      slug: block.children?.map((c: any) => c.text).join('').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '',
    })) || [];

  if (headings.length === 0) return null;

  return (
    <ul className="space-y-2 text-sm">
      {headings.map((heading) => (
        <li key={heading.slug} className={heading.level === 3 ? 'ml-4' : ''}>
          <a
            href={`#${heading.slug}`}
            className="text-muted-foreground hover:text-primary transition-colors block py-1"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

function getShareIcon(platform: string) {
  const icons: Record<string, React.ReactNode> = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    link: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  };
  return icons[platform] || icons.twitter;
}