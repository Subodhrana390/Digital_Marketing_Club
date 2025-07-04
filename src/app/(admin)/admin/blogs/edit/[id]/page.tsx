import { notFound } from "next/navigation";
import { BlogForm } from "@/components/blog-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getBlogPost } from "@/services/blogs";

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const post = await getBlogPost(params.id);

    if (!post) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Blog Post</CardTitle>
                <CardDescription>Update the details of your blog post below.</CardDescription>
            </CardHeader>
            <CardContent>
                <BlogForm post={post} />
            </CardContent>
        </Card>
    )
}
