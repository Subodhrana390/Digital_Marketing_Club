
"use client";

import { useRef, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addRegistrationAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UserPlus } from "lucide-react";
import { DialogClose } from "./ui/dialog";

const initialState = { message: "", errors: {}, success: false };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Registration"}
        </Button>
    )
}

export function EventRegistrationForm({ eventId }: { eventId: string }) {
    const addAction = addRegistrationAction.bind(null, eventId);
    const [state, formAction] = useActionState(addAction, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({ title: "Success!", description: state.message });
                formRef.current?.reset();
                closeRef.current?.click();
            } else {
                toast({ title: "Error", description: state.message, variant: "destructive" });
            }
        }
    }, [state, toast]);

  return (
    <>
    <form ref={formRef} action={formAction} className="grid gap-4 py-4">
        <div className="grid gap-2">
            <Label htmlFor="studentName">Student Name</Label>
            <Input id="studentName" name="studentName" placeholder="John Doe" />
            {state.errors?.studentName && <p className="text-sm text-destructive">{state.errors.studentName[0]}</p>}
        </div>
        <div className="grid gap-2">
            <Label htmlFor="studentEmail">Student Email</Label>
            <Input id="studentEmail" name="studentEmail" type="email" placeholder="john.doe@example.com" />
            {state.errors?.studentEmail && <p className="text-sm text-destructive">{state.errors.studentEmail[0]}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="urn">URN</Label>
                <Input id="urn" name="urn" placeholder="University Roll No." />
                {state.errors?.urn && <p className="text-sm text-destructive">{state.errors.urn[0]}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="crn">CRN</Label>
                <Input id="crn" name="crn" placeholder="College Roll No." />
                {state.errors?.crn && <p className="text-sm text-destructive">{state.errors.crn[0]}</p>}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" name="branch" placeholder="e.g., CSE" />
                {state.errors?.branch && <p className="text-sm text-destructive">{state.errors.branch[0]}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" name="mobileNumber" type="tel" placeholder="e.g., 9876543210" />
                {state.errors?.mobileNumber && <p className="text-sm text-destructive">{state.errors.mobileNumber[0]}</p>}
            </div>
        </div>
         <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Select name="year">
                <SelectTrigger id="year">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                </SelectContent>
            </Select>
            {state.errors?.year && <p className="text-sm text-destructive">{state.errors.year[0]}</p>}
        </div>
        <div className="mt-4">
            <SubmitButton />
        </div>
    </form>
    <DialogClose ref={closeRef} className="hidden" />
    </>
  );
}
