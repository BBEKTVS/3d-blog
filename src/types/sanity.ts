export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

export interface PortableTextBlock {
  _type: 'block';
  style?: string;
  children: PortableTextSpan[];
  markDefs?: Array<{ _key: string; _type: 'link'; href: string }>;
  listItem?: string;
  level?: number;
}

export interface PortableTextSpan {
  _type: 'span';
  text: string;
  marks?: string[];
}

export interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  image?: SanityImage;
  bio?: PortableTextBlock[];
  socialLinks?: { platform: string; url: string }[];
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color?: string;
  icon?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage?: SanityImage;
  content: PortableTextBlock[];
  publishedAt: string;
  author: Author;
  categories: Category[];
  featured?: boolean;
  readingTime?: number;
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
    ogImage?: SanityImage;
  };
}

export interface Settings {
  siteTitle: string;
  siteDescription: string;
  logo?: SanityImage;
  socialLinks: { platform: string; url: string }[];
  navigation: { label: string; href: string }[];
  footerText: string;
}