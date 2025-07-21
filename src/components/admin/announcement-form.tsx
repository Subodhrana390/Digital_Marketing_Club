
"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useRef, useEffect } from "react";
import type { Announcement } from "@/lib/types";
import { addAnnouncementAction, updateAnnouncementAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface AnnouncementFormProps {
  announcement?: Announcement | null;
}

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isUpdate ? "Update Announcement" : "Create Announcement"}
    </Button>
  );
}

export function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const isUpdate = !!announcement;
  const formRef = useRef<HTMLFormElement>(null);
  
  const action = isUpdate ? updateAnnouncementAction.bind(null, announcement.id) : addAnnouncementAction;
  const [state, formAction] = useActionState(action, { message: "", errors: {} });
  
  useEffect(() => {
      if (state.message && (!state.errors || Object.keys(state.errors).length === 0)) {
          formRef.current?.reset();
      }
  }, [state]);


  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          defaultValue={announcement?.message}
          placeholder="e.g., Registrations for the new workshop are now open!"
          required
        />
        {state.errors?.message && <p className="text-sm font-medium text-destructive">{state.errors.message[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (Optional)</Label>
        <Input
          id="link"
          name="link"
          type="url"
          defaultValue={announcement?.link}
          placeholder="https://example.com/workshop-details"
        />
        {state.errors?.link && <p className="text-sm font-medium text-destructive">{state.errors.link[0]}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="isActive" name="isActive" defaultChecked={announcement?.isActive || true} />
        <Label htmlFor="isActive" className="text-sm font-medium">
          Set as active announcement upon creation
        </Label>
      </div>

      <div className="flex justify-end">
        <SubmitButton isUpdate={isUpdate} />
      </div>
      {state.message && state.errors && Object.keys(state.errors).length > 0 && <p className="text-sm font-medium text-destructive mt-2">{state.message}</p>}
    </form>
  );
}
