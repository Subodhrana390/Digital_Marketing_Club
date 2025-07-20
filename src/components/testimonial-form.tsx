"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useTransition } from "react";
import Image from "next/image";
import type { Testimonial } from "@/lib/types";
import { addTestimonialAction, updateTestimonialAction, uploadImageAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
}

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isUpdate ? "Update Testimonial" : "Add Testimonial"}
    </Button>
  );
}

function ImageUploader({
  currentImageUrl,
  onImageUploaded,
}: {
  currentImageUrl: string | null;
  onImageUploaded: (url: string) => void;
}) {
  const [isUploading, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      startTransition(async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "testimonials");
        const result = await uploadImageAction(formData);
        if (result.url) {
          onImageUploaded(result.url);
          toast({ title: "Success", description: "Image uploaded successfully." });
        } else {
          setPreview(currentImageUrl);
          toast({ title: "Error", description: result.error, variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label>Avatar Image</Label>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 rounded-full border border-dashed flex items-center justify-center">
          {preview ? (
            <Image src={preview} alt="Preview" fill className="object-cover rounded-full" />
          ) : (
            <span className="text-xs text-muted-foreground">Preview</span>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
          <p className="text-xs text-muted-foreground mt-1">Select an image file to upload.</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const isUpdate = !!testimonial;
  const action = isUpdate ? updateTestimonialAction.bind(null, testimonial.id) : addTestimonialAction;
  const [state, formAction] = useActionState(action, { message: "", errors: {} });
  
  const [avatarUrl, setAvatarUrl] = useState(testimonial?.avatarUrl || "");

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="avatarUrl" value={avatarUrl} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" defaultValue={testimonial?.name} required />
          {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" defaultValue={testimonial?.role} placeholder="e.g., Student Member, 3rd Year" required />
          {state.errors?.role && <p className="text-sm font-medium text-destructive">{state.errors.role[0]}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quote">Quote</Label>
        <Textarea id="quote" name="quote" defaultValue={testimonial?.quote} placeholder="The testimonial text..." rows={5} required />
        {state.errors?.quote && <p className="text-sm font-medium text-destructive">{state.errors.quote[0]}</p>}
      </div>

      <ImageUploader 
        currentImageUrl={testimonial?.avatarUrl || null}
        onImageUploaded={setAvatarUrl}
      />
      {state.errors?.avatarUrl && <p className="text-sm font-medium text-destructive">{state.errors.avatarUrl[0]}</p>}

      <div className="space-y-2">
          <Label htmlFor="avatarHint">Avatar Hint (for AI)</Label>
          <Input id="avatarHint" name="avatarHint" defaultValue={testimonial?.avatarHint} placeholder="e.g., professional woman" />
      </div>

      <div className="flex justify-end">
        <SubmitButton isUpdate={isUpdate} />
      </div>
      {state.message && (!state.errors || Object.keys(state.errors).length === 0) && <p className="text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
