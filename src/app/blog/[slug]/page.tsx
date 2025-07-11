import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/services/blogs';
import { BlogContent } from '@/components/blog-content';
import type { Metadata, ResolvingMetadata } from 'next'

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: BlogPostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
 
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
 
  return {
    title: `${post.title} | MarketVerse`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  }
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogContent post={post} />;
}
