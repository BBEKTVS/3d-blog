'use client';

import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Post, Category } from '@/types/sanity';
import { useScrollAnimation } from '@/components/providers/SmoothScrollProvider';

interface BlogCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function BlogCard({ post, variant = 'default', className }: BlogCardProps) {
  const cardRef = useScrollAnimation({ start: 'top 85%' });

  const categories = post.categories?.slice(0, 2) || [];
  const readingTime = post.readingTime || Math.ceil((post.excerpt.split(' ').length + 200) / 200);

  const baseStyles = 'group relative overflow-hidden transition-all duration-500';
  const variantStyles = {
    default: 'card h-full flex flex-col',
    featured: 'card relative h-[400px] lg:h-[500px]',
    compact: 'card flex gap-4 p-4',
  };

  if (variant === 'featured') {
    return (
      <article ref={cardRef} className={cn(baseStyles, variantStyles.featured, className)}>
        {post.mainImage && (
          <Link href={`/blog/${post.slug.current}`} className="absolute inset-0 -z-10" aria-label={post.title}>
            <Image
              src={urlFor(post.mainImage).width(1200).height(800).fit('crop').url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
          </Link>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat: Category) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug.current}`}
                className="px-3 py-1 text-xs font-medium rounded-full border transition-colors"
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

          <Link href={`/blog/${post.slug.current}`} className="block">
            <h2 className="heading-lg text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>

          <p className="body text-muted-foreground mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              {post.author?.image && (
                <Link href={`/author/${post.author.slug.current}`} className="block">
                  <Image
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full border border-border"
                  />
                </Link>
              )}
              <div>
                <Link
                  href={`/author/${post.author?.slug.current}`}
                  className="font-medium text-sm text-foreground hover:text-primary transition-colors"
                >
                  {post.author?.name}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'short')}</time>
                  <span>·</span>
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
            <Link
              href={`/blog/${post.slug.current}`}
              className="btn-primary px-4 py-2 text-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            >
              Read More
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article ref={cardRef} className={cn(baseStyles, variantStyles.compact, className)}>
        {post.mainImage && (
          <Link href={`/blog/${post.slug.current}`} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden" aria-label={post.title}>
            <Image
              src={urlFor(post.mainImage).width(192).height(192).fit('crop').url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link href={`/blog/${post.slug.current}`}>
              <h3 className="heading-sm text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </Link>
            <p className="body-sm text-muted-foreground line-clamp-2 mb-3">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'short')}</time>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {categories.map((cat: Category) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug.current}`}
                  className="px-2 py-0.5 text-xs font-medium rounded border"
                  style={{ borderColor: cat.color ? `${cat.color}80` : 'hsl(var(--border))' }}
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article ref={cardRef} className={cn(baseStyles, variantStyles.default, className)}>
      {post.mainImage && (
        <Link href={`/blog/${post.slug.current}`} className="relative aspect-video mb-6 overflow-hidden rounded-xl" aria-label={post.title}>
          <Image
            src={urlFor(post.mainImage).width(800).height(450).fit('crop').url()}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat: Category) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug.current}`}
              className="px-3 py-1 text-xs font-medium rounded-full border transition-colors"
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

        <Link href={`/blog/${post.slug.current}`} className="block mb-4">
          <h2 className="heading-md text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="body text-muted-foreground mb-6 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            {post.author?.image && (
              <Link href={`/author/${post.author.slug.current}`} className="block">
                <Image
                  src={urlFor(post.author.image).width(40).height(40).url()}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full border border-border"
                />
              </Link>
            )}
            <div>
              <Link
                href={`/author/${post.author?.slug.current}`}
                className="font-medium text-sm text-foreground hover:text-primary transition-colors"
              >
                {post.author?.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'short')}</time>
                <span>·</span>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
          <Link
            href={`/blog/${post.slug.current}`}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Read more
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

interface BlogGridProps {
  posts: Post[];
  variant?: 'default' | 'featured' | 'compact';
  columns?: 1 | 2 | 3;
  className?: string;
}

export function BlogGrid({ posts, variant = 'default', columns = 3, className }: BlogGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground body-lg">No posts found.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-8',
        gridCols[columns],
        className
      )}
      role="list"
      aria-label="Blog posts"
    >
      {posts.map((post, index) => (
        <BlogCard
          key={post._id}
          post={post}
          variant={variant}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
        />
      ))}
    </div>
  );
}