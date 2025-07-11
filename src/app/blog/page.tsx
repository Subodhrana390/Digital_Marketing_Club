
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/services/blogs';
import type { BlogPost } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, BookOpen, Calendar, Clock, Search } from 'lucide-react';

const BlogPostCard = ({ post }: { post: BlogPost }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/20">
        <div className="relative h-56 w-full">
            <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={post.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <Badge variant="secondary" className="mb-3 w-fit bg-white/10 text-purple-300 border-purple-500/30">
                {post.category}
            </Badge>
            <h2 className="text-xl font-bold text-white mb-3 flex-grow line-clamp-2 group-hover:text-purple-300 transition-colors">
                {post.title}
            </h2>
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center text-xs text-gray-500 mb-6 space-x-4">
                <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                     {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {post.readTime} min read
                </div>
            </div>
            <Link href={`/blog/${post.slug}`} className="mt-auto w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600/80 to-pink-600/80 rounded-xl font-medium text-white text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 group/btn">
                Read More
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
        </div>
    </div>
);

const LoadingSkeletons = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <div className="p-6 space-y-4">
                    <Skeleton className="h-5 w-1/4 rounded-md" />
                    <Skeleton className="h-8 w-3/4 rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-xl mt-4" />
                </div>
            </div>
        ))}
    </div>
);

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchPosts() {
            setIsLoading(true);
            const fetchedPosts = await getBlogPosts();
            setPosts(fetchedPosts);
            setIsLoading(false);
        }
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
                <section className="pt-20 pb-12">
                    <div className="container mx-auto px-6 text-center">
                         <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm mb-6">
                            <BookOpen className="w-4 h-4 text-yellow-400 mr-2" />
                            <span className="text-sm font-medium text-gray-300">Our Blog</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
                            Digital Marketing Insights
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                           Explore articles, case studies, and expert analysis on the latest trends shaping the digital world.
                        </p>
                    </div>
                </section>

                 <div className="container mx-auto px-6 mb-12">
                    <div className="max-w-md mx-auto">
                        <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                        />
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-6 pb-20">
                    {isLoading ? (
                        <LoadingSkeletons />
                    ) : filteredPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <BlogPostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
                            <p className="text-gray-400">Try adjusting your search terms.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
