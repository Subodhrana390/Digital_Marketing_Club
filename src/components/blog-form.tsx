"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useTransition } from "react";
import type { BlogPost } from "@/lib/types";
import { addBlogPostAction, generateBlogPostContentAction, updateBlogPostAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface BlogFormProps {
  post?: BlogPost | null;
}

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
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
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [isGenerating, startTransition] = useTransition();

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
  
  const slugify = (str: string) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={post?.slug || slugify(title)} placeholder="my-awesome-post" required />
          {state.errors?.slug && <p className="text-sm font-medium text-destructive">{state.errors.slug[0]}</p>}
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" defaultValue={post?.category} placeholder="e.g., SEO, Content Marketing" required />
            {state.errors?.category && <p className="text-sm font-medium text-destructive">{state.errors.category[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" defaultValue={post?.author} placeholder="John Doe" required />
            {state.errors?.author && <p className="text-sm font-medium text-destructive">{state.errors.author[0]}</p>}
        </div>
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={post?.imageUrl} placeholder="https://placehold.co/600x400.png" required />
            {state.errors?.imageUrl && <p className="text-sm font-medium text-destructive">{state.errors.imageUrl[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="imageHint">Image Hint</Label>
            <Input id="imageHint" name="imageHint" defaultValue={post?.imageHint} placeholder="e.g., marketing team" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="excerpt">Excerpt</Label>
        </div>
        <Textarea id="excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} required />
        {state.errors?.excerpt && <p className="text-sm font-medium text-destructive">{state.errors.excerpt[0]}</p>}
      </div>

      <div className="space-y-2">
         <div className="flex justify-between items-center">
            <Label htmlFor="content">Content</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleGenerateContent} disabled={!title || isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate with AI
            </Button>
        </div>
        <Textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} rows={15} required />
        {state.errors?.content && <p className="text-sm font-medium text-destructive">{state.errors.content[0]}</p>}
      </div>

      <div className="flex justify-end">
        <SubmitButton isUpdate={isUpdate} />
      </div>
       {state.message && (!state.errors || Object.keys(state.errors).length === 0) && <p className="text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
