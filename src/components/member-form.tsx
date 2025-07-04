"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Member } from "@/lib/types";
import { addMemberAction, updateMemberAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

export function MemberForm({ member }: MemberFormProps) {
  const isUpdate = !!member;
  const action = isUpdate ? updateMemberAction.bind(null, member.id) : addMemberAction;
  const [state, formAction] = useFormState(action, { message: "" });
  
  const skills = member?.skills?.join(', ') || '';

  return (
    <form action={formAction} className="space-y-6">
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

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input id="avatarUrl" name="avatarUrl" defaultValue={member?.avatarUrl} placeholder="https://placehold.co/100x100.png" required />
            {state.errors?.avatarUrl && <p className="text-sm font-medium text-destructive">{state.errors.avatarUrl[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="avatarHint">Avatar Hint</Label>
            <Input id="avatarHint" name="avatarHint" defaultValue={member?.avatarHint} placeholder="e.g., person smiling" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Textarea id="skills" name="skills" defaultValue={skills} placeholder="e.g., SEO, Content Writing, PPC" required />
        <p className="text-xs text-muted-foreground">Enter skills separated by commas.</p>
        {state.errors?.skills && <p className="text-sm font-medium text-destructive">{state.errors.skills[0]}</p>}
      </div>

      <div className="flex justify-end">
        <SubmitButton isUpdate={isUpdate} />
      </div>
       {state.message && !state.errors && <p className="text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
