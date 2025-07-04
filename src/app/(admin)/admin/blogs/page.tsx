import Link from "next/link";
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
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { getBlogPosts } from "@/services/blogs";
import BlogActions from "@/components/admin/blog-actions";

export default async function AdminBlogsPage() {
  const blogPosts = await getBlogPosts();
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
          <Button size="sm" className="gap-1" asChild>
            <Link href="/admin/blogs/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Post
              </span>
            </Link>
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
              <TableRow key={post.id}>
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
                  <BlogActions postId={post.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
