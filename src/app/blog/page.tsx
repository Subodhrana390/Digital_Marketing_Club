import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, User, Calendar } from "lucide-react";
import { getBlogPosts } from "@/services/blogs";

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Latest insights & trends
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent font-headline">
              From the Blog
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover cutting-edge strategies, expert insights, and actionable tips 
              to elevate your digital marketing game.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group">
              <Card className="h-full overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 transform-gpu">
                <CardHeader className="p-0 relative">
                  <div className="relative h-64 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint={post.imageHint}
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-slate-800 border-0 shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
                      >
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
                
                <CardFooter className="p-6 pt-0 space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>5 min read</span>
                    </div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      <span>Read More</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-10 animate-bounce"></div>
    </div>
  );
}