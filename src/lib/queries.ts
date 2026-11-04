import { groq } from 'next-sanity';

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  author->{_id, name, slug, image, bio},
  categories[]{_id, title, slug, color, icon},
  featured,
  readingTime,
  tags,
  seo
}`;

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  content,
  publishedAt,
  author->{_id, name, slug, image, bio, socialLinks},
  categories[]{_id, title, slug, color, icon},
  featured,
  readingTime,
  tags,
  seo
}`;

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`;

export const categoryQuery = groq`*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  color,
  icon,
  "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
    _id, title, slug, excerpt, mainImage, publishedAt, author->, categories[], readingTime
  }
}`;

export const categoriesQuery = groq`*[_type == "category"] | order(title asc) {
  _id, title, slug, description, color, icon,
  "postCount": count(*[_type == "post" && references(^._id)])
}`;

export const featuredPostsQuery = groq`*[_type == "post" && featured == true && defined(slug.current)] | order(publishedAt desc)[0...3] {
  _id, title, slug, excerpt, mainImage, publishedAt, author->, categories[], readingTime
}`;

export const relatedPostsQuery = groq`*[_type == "post" && _id != $id && count(categories[@._ref in $categoryIds]) > 0] | order(publishedAt desc)[0...3] {
  _id, title, slug, excerpt, mainImage, publishedAt, author->, categories[], readingTime
}`;