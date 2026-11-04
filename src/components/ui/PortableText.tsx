'use client';

import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SanityImage, PortableTextBlock } from '@/types/sanity';

const serializers = {
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string; alt?: string } }) => (
      <figure className="my-8 relative">
        {value.asset?._ref && (
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src={urlFor(value).width(1200).height(675).fit('crop').url()}
              alt={value.alt || value.caption || 'Image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
        {value.caption && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    code: ({ value }: { value: { code: string; language?: string } }) => (
      <div className="my-6 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="px-3 py-1 text-xs bg-muted border border-border rounded hover:bg-accent transition-colors"
            onClick={() => navigator.clipboard.writeText(value.code)}
            aria-label="Copy code"
          >
            Copy
          </button>
        </div>
        <pre className="bg-[#0d1117] border border-border rounded-2xl overflow-x-auto p-5">
          <code className={cn('text-sm font-mono leading-relaxed', `language-${value.language || 'text'}`)}>
            {value.code}
          </code>
        </pre>
      </div>
    ),
    link: ({ value, children }: { value: { href: string }; children: React.ReactNode }) => (
      <a
        href={value.href}
        target={value.href.startsWith('http') ? '_blank' : undefined}
        rel={value.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="link text-primary font-medium"
      >
        {children}
      </a>
    ),
  },
  marks: {
    link: ({ value, children }: { value: { href: string }; children: React.ReactNode }) => (
      <a
        href={value.href}
        target={value.href.startsWith('http') ? '_blank' : undefined}
        rel={value.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="link text-primary font-medium"
      >
        {children}
      </a>
    ),
    highlight: ({ children }: { children: React.ReactNode }) => (
      <mark className="bg-primary/30 text-primary-foreground px-1 rounded">{children}</mark>
    ),
  },
  blocks: {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="heading-xl text-foreground mt-12 mb-6">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="heading-lg text-foreground mt-10 mb-5">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="heading-md text-foreground mt-8 mb-4">{children}</h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="heading-sm text-foreground mt-6 mb-3">{children}</h4>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="my-8 border-l-4 border-primary pl-6 italic text-muted-foreground/90">
        <p className="body-lg">{children}</p>
      </blockquote>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="my-6 list-disc list-inside space-y-2 ml-4">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="my-6 list-decimal list-inside space-y-2 ml-4">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="body leading-relaxed">{children}</li>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="body text-foreground/90 leading-relaxed my-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <li className="body leading-relaxed ml-4 marker:text-primary">{children}</li>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <li className="body leading-relaxed ml-4">{children}</li>
    ),
  },
};

interface PortableTextProps {
  blocks: PortableTextBlock[] | undefined;
  className?: string;
}

export function PortableTextRenderer({ blocks, className }: PortableTextProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={cn('prose prose-invert max-w-none', className)}>
      <PortableText
        value={blocks}
        components={serializers}
        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
      />
    </div>
  );
}