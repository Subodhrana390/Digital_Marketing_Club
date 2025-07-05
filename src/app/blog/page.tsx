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
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/services/blogs";

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          From the Blog
        </h1>
        <p className="text-lg text-muted-foreground">
          Insights, trends, and stories from the world of digital marketing.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="relative h-60 w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={post.imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Badge
                  variant="outline"
                  className="mb-2 border-accent text-accent"
                >
                  {post.category}
                </Badge>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                <span>
                  {post.author} &bull;{" "}
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <div className="flex items-center text-primary group-hover:text-accent-foreground">
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
