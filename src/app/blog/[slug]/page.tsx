import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/services/blogs';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Clock, User, Share2, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

  const publishedDate = new Date(post.date).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const updatedDate = post.updatedAt ? new Date(post.updatedAt).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }) : null;
  const showUpdatedDate = updatedDate && updatedDate !== publishedDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8 max-w-4xl">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transform transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
          <article className="relative">
            {/* Category Badge */}
            <div className="text-center mb-6">
              <Badge 
                variant="secondary" 
                className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg text-blue-600 dark:text-blue-400 font-medium"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {post.category}
              </Badge>
            </div>

            {/* Title */}
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent font-headline leading-tight">
                {post.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{publishedDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>8 min read</span>
                </div>
                <button className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Updated Date */}
              {showUpdatedDate && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  Updated on {updatedDate}
                </div>
              )}
            </div>

            {/* Hero Image */}
            <div className="relative h-96 md:h-[500px] w-full mb-16 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-700"
                data-ai-hint={post.imageHint}
                priority
              />
            </div>

            {/* Content */}
            <div className="relative">
              {/* Floating Content Container */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 dark:border-slate-700/20">
                
                {/* Excerpt */}
                <div className="mb-12 pb-8 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-xl md:text-2xl leading-relaxed text-slate-700 dark:text-slate-300 font-light italic">
                    {post.excerpt}
                  </p>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-headings:bg-gradient-to-r prose-headings:from-slate-900 prose-headings:to-slate-600 dark:prose-headings:from-white dark:prose-headings:to-slate-300 prose-headings:bg-clip-text prose-headings:text-transparent prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                  </ReactMarkdown>
                </div>

                {/* Article Footer */}
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{post.author}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Digital Marketing Expert</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors text-sm font-medium">
                        Follow
                      </button>
                      <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full transition-colors text-sm font-medium">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-32 left-8 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="fixed bottom-32 right-8 w-24 h-24 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-10 animate-bounce"></div>
    </div>
  );
}

// Optional: Improve SEO by generating static pages at build time
// export async function generateStaticParams() {
//   const posts = await getBlogPosts();
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }