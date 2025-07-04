"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import type { Resource } from "@/lib/types";
import { addResourceAction, updateResourceAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResourceFormProps {
  resource?: Resource | null;
}

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isUpdate ? "Update Resource" : "Create Resource"}
    </Button>
  );
}

export function ResourceForm({ resource }: ResourceFormProps) {
  const isUpdate = !!resource;
  const action = isUpdate ? updateResourceAction.bind(null, resource.id) : addResourceAction;
  const [state, formAction] = useActionState(action, { message: "" });

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={resource?.name} required />
        {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input id="url" name="url" type="url" defaultValue={resource?.url} placeholder="https://example.com" required />
        {state.errors?.url && <p className="text-sm font-medium text-destructive">{state.errors.url[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={resource?.category}>
            <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Tool">Tool</SelectItem>
                <SelectItem value="Template">Template</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
            </SelectContent>
        </Select>
        {state.errors?.category && <p className="text-sm font-medium text-destructive">{state.errors.category[0]}</p>}
      </div>
      

      <div className="flex justify-end">
        <SubmitButton isUpdate={isUpdate} />
      </div>
       {state.message && !state.errors && <p className="text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
