"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { addAdminAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        "Add Admin"
      )}
    </Button>
  );
}

export function AddAdminForm() {
  const [state, formAction] = useActionState(addAdminAction, { message: "", errors: {} });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.success) {
      toast({ title: "Success", description: state.message });
      formRef.current?.reset();
    } else if (state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row items-end gap-4">
      <div className="w-full space-y-2">
        <Label htmlFor="email">Admin Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@example.com"
          required
        />
        {state?.errors?.email && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.email[0]}
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}