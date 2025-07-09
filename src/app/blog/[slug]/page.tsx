'use client';

import { useState, useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/services/blogs';
import type { BlogPost } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Calendar, Clock, User, Share2, BookOpen, ArrowLeft, List } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- Sub-components for Share Button and Table of Contents ---

interface ShareButtonProps {
    title: string;
    text: string;
}

function ShareButton({ title, text }: ShareButtonProps) {
    const { toast } = useToast();

    const handleShare = async () => {
        const shareData = {
            title,
            text,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast({
                    title: 'Link Copied!',
                    description: 'The blog post URL has been copied to your clipboard.',
                });
            } catch (err) {
                console.error('Failed to copy: ', err);
                toast({
                    title: 'Error',
                    description: 'Failed to copy the link.',
                    variant: 'destructive',
                });
            }
        }
    };

    return (
        <Button onClick={handleShare} variant="ghost" size="sm" className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
        </Button>
    );
}

interface Heading {
  id: string;
  level: number;
  text: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    if(headingElements.length === 0) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight / 2) {
                 setActiveId(entry.target.id);
            }
        }
      },
      { rootMargin: '0px 0px -40% 0px', threshold: 0.2 }
    );

    headingElements.forEach((el) => observer.current?.observe(el!));

    return () => observer.current?.disconnect();
  }, [headings]);
  
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-28 hidden lg:block self-start">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-800 dark:text-slate-200">
            <List className="mr-2 h-5 w-5" />
            Table of Contents
        </h3>
        <nav>
            <ul>
                {headings.map((heading) => (
                    <li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 1}rem` }}>
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector(`#${heading.id}`)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }}
                            className={cn(
                                "block py-1.5 text-sm transition-colors",
                                activeId === heading.id
                                    ? "font-bold text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    </aside>
  );
}


// --- Main Blog Post Page Component ---

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      const fetchedPost = await getBlogPostBySlug(params.slug);
      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        notFound();
      }
      setIsLoading(false);
    };
    fetchPost();
  }, [params.slug]);

  useEffect(() => {
    if (!post || !contentRef.current) return;
    
    // Give ReactMarkdown and rehype-slug time to render and add IDs
    const timeoutId = setTimeout(() => {
        const headingElements = contentRef.current?.querySelectorAll('h2, h3, h4');
        const extractedHeadings: Heading[] = Array.from(headingElements).map(el => ({
            id: el.id,
            text: el.textContent || '',
            level: parseInt(el.tagName.substring(1), 10)
        }));
        setHeadings(extractedHeadings);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [post]);


  if (isLoading || !post) {
    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl space-y-8">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full" />
        </div>
    );
  }

  const publishedDate = new Date(post.date).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8 max-w-7xl">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transform transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>
      </div>

      <header className="relative overflow-hidden py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-6">
              <Badge 
                variant="secondary" 
                className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg text-blue-600 dark:text-blue-400 font-medium"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {post.category}
              </Badge>
            </div>
            <h1 className="text-center text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent font-headline leading-tight">
                {post.title}
            </h1>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-sm text-slate-600 dark:text-slate-400">
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
                  <span>{post.readTime} min read</span>
                </div>
                <ShareButton title={post.title} text={post.excerpt} />
            </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative h-96 md:h-[500px] w-full mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                data-ai-hint={post.imageHint}
                priority
              />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
            <main ref={contentRef} className="lg:col-span-3">
                 <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 dark:border-slate-700/20">
                    <div className="mb-12 pb-8 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-xl md:text-2xl leading-relaxed text-slate-700 dark:text-slate-300 font-light italic">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="prose prose-lg dark:prose-invert max-w-none 
                                    prose-headings:font-headline prose-headings:scroll-mt-24
                                    prose-headings:bg-gradient-to-r prose-headings:from-slate-900 prose-headings:to-slate-600 dark:prose-headings:from-white dark:prose-headings:to-slate-300 prose-headings:bg-clip-text prose-headings:text-transparent
                                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline 
                                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg 
                                    prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm 
                                    prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-700
                                    prose-img:rounded-xl prose-img:shadow-lg
                                    prose-table:border-collapse prose-table:w-full
                                    prose-thead:border-b prose-thead:border-slate-300 dark:prose-thead:border-slate-600
                                    prose-th:px-4 prose-th:py-2 prose-th:text-left
                                    prose-tbody:divide-y prose-tbody:divide-slate-200 dark:prose-tbody:divide-slate-700
                                    prose-td:p-4
                                    ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                 </div>
            </main>
            <TableOfContents headings={headings} />
        </div>
      </div>

       <footer className="mt-16 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
             <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
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
                </div>
            </div>
          </div>
       </footer>
    </div>
  );
}
