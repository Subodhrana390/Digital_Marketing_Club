"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useTransition } from "react";
import type { BlogPost } from "@/lib/types";
import { addBlogPostAction, generateBlogPostContentAction, updateBlogPostAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

interface BlogFormProps {
  post?: BlogPost | null;
}

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isUpdate ? "Update Post" : "Create Post"}
    </Button>
  );
}

export function BlogForm({ post }: BlogFormProps) {
  const isUpdate = !!post;
  const action = isUpdate ? updateBlogPostAction.bind(null, post.id) : addBlogPostAction;
  const [state, formAction] = useActionState(action, { message: "", errors: {} });
  
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [isGenerating, startTransition] = useTransition();
  
  const slugify = (str: string) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isUpdate) {
        setSlug(slugify(newTitle));
    }
  };

  const handleGenerateContent = () => {
    startTransition(async () => {
      const result = await generateBlogPostContentAction(title);
      if (result.data) {
        setExcerpt(result.data.excerpt);
        setContent(result.data.content);
      } else {
        // Handle error, maybe show a toast
        console.error(result.error);
      }
    });
  };

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      {/* Main Content Column */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <Label htmlFor="title" className="text-base">Title</Label>
            </CardHeader>
            <CardContent>
                <Input id="title" name="title" value={title} onChange={handleTitleChange} required placeholder="Your blog post title..."/>
                {state.errors?.title && <p className="text-sm font-medium text-destructive mt-2">{state.errors.title[0]}</p>}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <Label htmlFor="content" className="text-base">Content</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateContent} disabled={!title || isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate with AI
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} rows={20} required placeholder="Write your amazing blog post here..."/>
                <p className="text-xs text-muted-foreground mt-2">Use Markdown for formatting. Headings (e.g., ## Section Title) create sections for the Table of Contents. You can also add lists, links, tables, and images using `![alt text](image_url)`.</p>
                {state.errors?.content && <p className="text-sm font-medium text-destructive mt-2">{state.errors.content[0]}</p>}
            </CardContent>
        </Card>
      </div>

      {/* Sidebar Column */}
      <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
        <Card>
            <CardHeader>
                <CardTitle>Publish</CardTitle>
                <CardDescription>Manage publishing settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <SubmitButton isUpdate={isUpdate} />
                {state.message && (!state.errors || Object.keys(state.errors).length === 0) && <p className="text-sm font-medium text-destructive mt-2">{state.message}</p>}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-awesome-post" required />
                    {state.errors?.slug && <p className="text-sm font-medium text-destructive">{state.errors.slug[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" defaultValue={post?.category} placeholder="e.g., SEO" required />
                    {state.errors?.category && <p className="text-sm font-medium text-destructive">{state.errors.category[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" name="author" defaultValue={post?.author} placeholder="John Doe" required />
                    {state.errors?.author && <p className="text-sm font-medium text-destructive">{state.errors.author[0]}</p>}
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" defaultValue={post?.imageUrl} placeholder="https://placehold.co/800x400.png" required />
                    {state.errors?.imageUrl && <p className="text-sm font-medium text-destructive">{state.errors.imageUrl[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageHint">Image Hint</Label>
                    <Input id="imageHint" name="imageHint" defaultValue={post?.imageHint} placeholder="e.g., marketing team" />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea id="excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={4} required placeholder="A short summary of the post..." />
                {state.errors?.excerpt && <p className="text-sm font-medium text-destructive">{state.errors.excerpt[0]}</p>}
            </CardContent>
        </Card>
      </div>
    </form>
  );
}
