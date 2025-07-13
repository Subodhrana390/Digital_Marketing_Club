
"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useTransition } from "react";
import Image from "next/image";
import type { Member } from "@/lib/types";
import { addMemberAction, updateMemberAction, uploadImageAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Linkedin, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MemberFormProps {
  member?: Member | null;
}

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isUpdate ? "Update Member" : "Add Member"}
    </Button>
  );
}

function ImageUploader({
  label,
  currentImageUrl,
  onImageUploaded,
  folder,
  disabled = false
}: {
  label: string;
  currentImageUrl: string | null;
  onImageUploaded: (url: string) => void;
  folder: string;
  disabled?: boolean;
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
        formData.append("folder", folder);
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
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 rounded-md border border-dashed flex items-center justify-center">
          {preview && !disabled ? (
            <Image src={preview} alt="Preview" fill className="object-cover rounded-md" />
          ) : (
            <span className="text-xs text-muted-foreground">{disabled ? 'N/A' : 'Preview'}</span>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading || disabled} />
          <p className="text-xs text-muted-foreground mt-1">
            {disabled ? "Avatar is not needed for Active Members." : "Select an image file to upload."}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MemberForm({ member }: MemberFormProps) {
  const isUpdate = !!member;
  const action = isUpdate ? updateMemberAction.bind(null, member.id) : addMemberAction;
  const [state, formAction] = useActionState(action, { message: "", errors: {} });
  
  const [avatarUrl, setAvatarUrl] = useState(member?.avatarUrl || "");
  const [memberType, setMemberType] = useState<'Core' | 'Active'>(member?.type || 'Core');
  const skills = member?.skills?.join(', ') || '';
  
  const currentYear = new Date().getFullYear();
  const sessions = [
      `${currentYear-1}-${currentYear}`,
      `${currentYear}-${currentYear+1}`,
      `${currentYear+1}-${currentYear+2}`,
  ];

  const handleAvatarUploaded = (url: string) => {
      setAvatarUrl(url);
  };
  
  const isAvatarDisabled = memberType === 'Active';

  return (
    <form action={formAction} className="space-y-6">
       <input type="hidden" name="avatarUrl" value={isAvatarDisabled ? '' : avatarUrl} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" defaultValue={member?.name} required />
          {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" defaultValue={member?.role} placeholder="e.g., President, Member" required />
          {state.errors?.role && <p className="text-sm font-medium text-destructive">{state.errors.role[0]}</p>}
        </div>
      </div>
      
       <Card>
        <CardContent className="p-6">
             <div className="space-y-6">
                <ImageUploader 
                    label="Avatar Image"
                    currentImageUrl={member?.avatarUrl || null}
                    onImageUploaded={handleAvatarUploaded}
                    folder="member-avatars"
                    disabled={isAvatarDisabled}
                />
                 {state.errors?.avatarUrl && <p className="text-sm font-medium text-destructive">{state.errors.avatarUrl[0]}</p>}
                
                <div className="space-y-2">
                    <Label htmlFor="avatarHint">Avatar Hint</Label>
                    <Input id="avatarHint" name="avatarHint" defaultValue={member?.avatarHint} placeholder="e.g., person smiling" disabled={isAvatarDisabled} />
                </div>
            </div>
        </CardContent>
       </Card>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={member?.description} placeholder="A short bio or description about the member." rows={3} />
        {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Textarea id="skills" name="skills" defaultValue={skills} placeholder="e.g., SEO, Content Writing, PPC" required />
          <p className="text-xs text-muted-foreground">Enter skills separated by commas.</p>
          {state.errors?.skills && <p className="text-sm font-medium text-destructive">{state.errors.skills[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="session">Session</Label>
            <Select name="session" defaultValue={member?.session}>
                <SelectTrigger id="session">
                    <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                    {sessions.map(session => (
                        <SelectItem key={session} value={session}>{session}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {state.errors?.session && <p className="text-sm font-medium text-destructive">{state.errors.session[0]}</p>}
        </div>
         <div className="space-y-2">
            <Label htmlFor="type">Member Type</Label>
            <Select name="type" defaultValue={memberType} onValueChange={(value) => setMemberType(value as 'Core' | 'Active')}>
                <SelectTrigger id="type">
                    <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Core">Core Member</SelectItem>
                    <SelectItem value="Active">Active Member</SelectItem>
                </SelectContent>
            </Select>
            {state.errors?.type && <p className="text-sm font-medium text-destructive">{state.errors.type[0]}</p>}
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="flex items-center gap-2"><Linkedin className="h-4 w-4" />LinkedIn Profile URL</Label>
                <Input id="linkedinUrl" name="linkedinUrl" type="url" defaultValue={member?.linkedinUrl} placeholder="https://linkedin.com/in/..." />
                {state.errors?.linkedinUrl && <p className="text-sm font-medium text-destructive">{state.errors.linkedinUrl[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="githubUrl" className="flex items-center gap-2"><Github className="h-4 w-4" />GitHub Profile URL</Label>
                <Input id="githubUrl" name="githubUrl" type="url" defaultValue={member?.githubUrl} placeholder="https://github.com/..." />
                {state.errors?.githubUrl && <p className="text-sm font-medium text-destructive">{state.errors.githubUrl[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="googleUrl" className="flex items-center gap-2">
                    <svg className="h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C307.4 99.4 280.7 86 248 86c-84.3 0-152.3 68.3-152.3 152S163.7 384 248 384c87.7 0 140.2-61.9 144-131.6H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.8z"></path></svg>
                    Google Profile URL
                </Label>
                <Input id="googleUrl" name="googleUrl" type="url" defaultValue={member?.googleUrl} placeholder="https://..." />
                {state.errors?.googleUrl && <p className="text-sm font-medium text-destructive">{state.errors.googleUrl[0]}</p>}
            </div>
        </CardContent>
      </Card>


      <div className="flex justify-end">
        <SubmitButton isUpdate={isUpdate} />
      </div>
       {state.message && (!state.errors || Object.keys(state.errors).length === 0) && <p className="text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
