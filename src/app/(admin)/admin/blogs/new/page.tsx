import { BlogForm } from "@/components/blog-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewBlogPostPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Blog Post</CardTitle>
                <CardDescription>Fill out the form below to publish a new article.</CardDescription>
            </CardHeader>
            <CardContent>
                <BlogForm />
            </CardContent>
        </Card>
    )
}
