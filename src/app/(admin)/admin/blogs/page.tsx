import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const blogPosts = [
  {
    title: "5 SEO Trends to Watch in 2024",
    excerpt:
      "The world of SEO is ever-evolving. Stay ahead of the curve with these 5 key trends that will dominate the digital landscape this year.",
    author: "Jane Doe",
    date: "2024-09-01",
    category: "SEO",
    imageUrl: "https://placehold.co/600x400.png",
    slug: "/blog/seo-trends-2024",
  },
  {
    title: "The Art of Storytelling in Social Media Marketing",
    excerpt:
      "Learn how to craft compelling narratives that resonate with your audience and build a loyal community around your brand.",
    author: "John Smith",
    date: "2024-08-25",
    category: "Social Media",
    imageUrl: "https://placehold.co/600x400.png",
    slug: "/blog/social-media-storytelling",
  },
  {
    title: "A Student's Guide to Acing Your First Marketing Internship",
    excerpt:
      "Our club president shares their top tips and experiences to help you make the most of your first marketing internship.",
    author: "Alice Johnson",
    date: "2024-08-12",
    category: "Career",
    imageUrl: "https://placehold.co/600x400.png",
    slug: "/blog/marketing-internship-guide",
  },
  {
    title: "Unpacking the Power of Email Marketing Automation",
    excerpt:
      "Discover how to set up effective email automation workflows that nurture leads and drive conversions while you sleep.",
    author: "Mike Brown",
    date: "2024-07-30",
    category: "Email Marketing",
    imageUrl: "https://placehold.co/600x400.png",
    slug: "/blog/email-automation-power",
  },
];

export default function AdminBlogsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>
              Manage your blog posts and content.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Post
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Author</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.map((post) => (
              <TableRow key={post.title}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={post.title}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={post.imageUrl}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{post.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {post.author}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}