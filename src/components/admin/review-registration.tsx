
"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { MemberRegistration } from "@/lib/types";
import { approveMemberRegistrationAction, rejectMemberRegistrationAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";


interface ReviewRegistrationProps {
    registration: MemberRegistration;
    isButton?: boolean;
}

export function ReviewRegistration({ registration, isButton = false }: ReviewRegistrationProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveMemberRegistrationAction(registration);
      if(result.success) {
        toast({ title: "Success", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
       const result = await rejectMemberRegistrationAction(registration.id);
        if(result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    });
  };

  const badgeVariant = {
    pending: "secondary",
    approved: "default",
    rejected: "destructive",
  }[registration.status] as "secondary" | "default" | "destructive";

  if (!isButton) {
      return <Badge variant={badgeVariant}>{registration.status}</Badge>
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={registration.status !== 'pending'}>
          {registration.status === 'pending' ? 'Review' : 'Processed'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Review Member Application</DialogTitle>
          <DialogDescription>
            Review the applicant's details and choose to approve or reject their application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{registration.studentName}</span>
            </div>
             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-muted-foreground">Email</span>
                <span>{registration.studentEmail}</span>
            </div>
             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-muted-foreground">Branch & Year</span>
                <span>{registration.branch}, {registration.year} Year</span>
            </div>
             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-muted-foreground">URN / CRN</span>
                <span>{registration.urn} / {registration.crn}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-muted-foreground">Mobile</span>
                <span>{registration.mobileNumber}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-muted-foreground">Applied On</span>
                <span>{new Date(registration.createdAt).toLocaleString()}</span>
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleReject} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject
          </Button>
          <Button type="button" onClick={handleApprove} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
