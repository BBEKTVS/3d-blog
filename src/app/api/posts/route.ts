import { sanityClient } from '@/lib/sanity';
import { postsQuery, postQuery, postSlugsQuery, categoryQuery, categoriesQuery, featuredPostsQuery, relatedPostsQuery } from '@/lib/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');
  const categoryIds = searchParams.get('categoryIds')?.split(',');

  try {
    let data;

    switch (type) {
      case 'all':
        data = await sanityClient.fetch(postsQuery);
        break;
      case 'single':
        if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });
        data = await sanityClient.fetch(postQuery, { slug });
        break;
      case 'slugs':
        data = await sanityClient.fetch(postSlugsQuery);
        break;
      case 'category':
        if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });
        data = await sanityClient.fetch(categoryQuery, { slug });
        break;
      case 'categories':
        data = await sanityClient.fetch(categoriesQuery);
        break;
      case 'featured':
        data = await sanityClient.fetch(featuredPostsQuery);
        break;
      case 'related':
        if (!id || !categoryIds) return NextResponse.json({ error: 'ID and categoryIds required' }, { status: 400 });
        data = await sanityClient.fetch(relatedPostsQuery, { id, categoryIds });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}