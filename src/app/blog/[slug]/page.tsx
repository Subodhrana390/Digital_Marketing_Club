import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/services/blogs';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const updatedDate = post.updatedAt ? new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;
  const showUpdatedDate = updatedDate && updatedDate !== publishedDate;


  return (
    <article className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
      <div className="space-y-4 mb-8 text-center">
        <Badge variant="outline" className="text-sm border-accent text-accent">{post.category}</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">{post.title}</h1>
        <p className="text-muted-foreground">
          By {post.author} on {publishedDate}
          {showUpdatedDate && (
            <span className="italic"> (Updated on {updatedDate})</span>
          )}
        </p>
      </div>
      
      <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          data-ai-hint={post.imageHint}
          priority
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
        <p className="lead text-xl text-muted-foreground mb-8">{post.excerpt}</p>
        <div className="whitespace-pre-wrap">{post.content}</div>
      </div>
    </article>
  );
}

// Optional: Improve SEO by generating static pages at build time
// export async function generateStaticParams() {
//   const posts = await getBlogPosts();
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }
