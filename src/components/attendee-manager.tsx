"use client";

import { useState, useEffect, useTransition, useRef, useActionState } from "react";
import type { Event, Registration } from "@/lib/types";
import { getRegistrationsForEvent } from "@/services/events";
import { addRegistrationAction, updateAttendanceAction, deleteRegistrationAction, generateCertificateAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, UserPlus, Trash2, Award, Download, AlertCircle } from "lucide-react";

interface AttendeeManagerProps {
  event: Event;
}

const initialState = { message: "", errors: {} };

export function AttendeeManager({ event }: AttendeeManagerProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingCertId, setGeneratingCertId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const addAction = addRegistrationAction.bind(null, event.id);
  const [state, formAction] = useActionState(addAction, initialState);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setIsLoading(true);
      const fetchedRegistrations = await getRegistrationsForEvent(event.id);
      setRegistrations(fetchedRegistrations);
      setIsLoading(false);
    };
    fetchRegistrations();
  }, [event.id]);

  useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        toast({ title: "Error", description: state.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: state.message });
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  const handleAttendanceChange = (registrationId: string, attended: boolean) => {
    startTransition(async () => {
      const result = await updateAttendanceAction(event.id, registrationId, attended);
      if (result.success) {
        setRegistrations(regs => regs.map(r => r.id === registrationId ? { ...r, attended } : r));
        toast({ description: result.message });
      } else {
        toast({ description: result.message, variant: "destructive" });
      }
    });
  };

  const handleDelete = (registrationId: string) => {
    startTransition(async () => {
      if(confirm("Are you sure you want to remove this registration?")) {
        const result = await deleteRegistrationAction(event.id, registrationId);
        if (result.success) {
          setRegistrations(regs => regs.filter(r => r.id !== registrationId));
          toast({ description: result.message });
        } else {
          toast({ description: result.message, variant: "destructive" });
        }
      }
    });
  };

  const handleGenerateCertificate = (registration: Registration) => {
    startTransition(async () => {
      setGeneratingCertId(registration.id);
      const result = await generateCertificateAction(event.id, registration.id, registration.studentName, event.title);
      if (result.success) {
        setRegistrations(regs => regs.map(r => r.id === registration.id ? { ...r, certificateUrl: result.certificateUrl } : r));
        toast({ title: "Success", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setGeneratingCertId(null);
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Attendance & Certificates</CardTitle>
        <CardDescription>Manage registered students for this event.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row gap-4 items-end mb-6 p-4 border rounded-lg">
          <div className="grid gap-2 flex-grow w-full sm:w-auto">
            <Label htmlFor="studentName">Student Name</Label>
            <Input id="studentName" name="studentName" placeholder="John Doe" />
            {state.errors?.studentName && <p className="text-sm text-destructive">{state.errors.studentName[0]}</p>}
          </div>
          <div className="grid gap-2 flex-grow w-full sm:w-auto">
            <Label htmlFor="studentEmail">Student Email</Label>
            <Input id="studentEmail" name="studentEmail" type="email" placeholder="john.doe@example.com" />
            {state.errors?.studentEmail && <p className="text-sm text-destructive">{state.errors.studentEmail[0]}</p>}
          </div>
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Registrant
          </Button>
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Attended</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : registrations.length > 0 ? (
                registrations.map(reg => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.studentName}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{reg.studentEmail}</TableCell>
                    <TableCell>
                      <Switch
                        checked={reg.attended}
                        onCheckedChange={(checked) => handleAttendanceChange(reg.id, checked)}
                        disabled={isPending}
                      />
                    </TableCell>
                    <TableCell>
                      {reg.certificateUrl ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={reg.certificateUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" /> View
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={!reg.attended || isPending || generatingCertId === reg.id}
                          onClick={() => handleGenerateCertificate(reg)}
                        >
                          {generatingCertId === reg.id ? (
                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Award className="mr-2 h-4 w-4" />
                          )}
                          Generate
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => handleDelete(reg.id)} disabled={isPending}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No students registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
