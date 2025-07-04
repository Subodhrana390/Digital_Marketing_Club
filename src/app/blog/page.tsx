import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "5 SEO Trends to Watch in 2024",
    excerpt: "The world of SEO is ever-evolving. Stay ahead of the curve with these 5 key trends that will dominate the digital landscape this year.",
    author: "Jane Doe",
    date: "2024-09-01",
    category: "SEO",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "data analysis chart",
    slug: "/blog/seo-trends-2024",
  },
  {
    title: "The Art of Storytelling in Social Media Marketing",
    excerpt: "Learn how to craft compelling narratives that resonate with your audience and build a loyal community around your brand.",
    author: "John Smith",
    date: "2024-08-25",
    category: "Social Media",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "social media icons",
    slug: "/blog/social-media-storytelling",
  },
  {
    title: "A Student's Guide to Acing Your First Marketing Internship",
    excerpt: "Our club president shares their top tips and experiences to help you make the most of your first marketing internship.",
    author: "Alice Johnson",
    date: "2024-08-12",
    category: "Career",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "person working laptop",
    slug: "/blog/marketing-internship-guide",
  },
  {
    title: "Unpacking the Power of Email Marketing Automation",
    excerpt: "Discover how to set up effective email automation workflows that nurture leads and drive conversions while you sleep.",
    author: "Mike Brown",
    date: "2024-07-30",
    category: "Email Marketing",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "email inbox interface",
    slug: "/blog/email-automation-power",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">From the Blog</h1>
        <p className="text-lg text-muted-foreground">
          Insights, trends, and stories from the world of digital marketing.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link href={post.slug} key={post.title} className="group">
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
                <Badge variant="outline" className="mb-2 border-accent text-accent">{post.category}</Badge>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                <span>{post.author} &bull; {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
