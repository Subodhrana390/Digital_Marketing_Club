
"use client";

import { useState, useEffect, useTransition, useRef, useActionState } from "react";
import type { Event, Registration } from "@/lib/types";
import { getRegistrationsForEvent } from "@/services/events";
import { 
    addRegistrationAction, 
    updateAttendanceAction, 
    deleteRegistrationAction, 
    uploadAttendeeCertificateAction,
    sendAttendeeCertificateAction,
    sendBulkCertificatesAction
} from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, UserPlus, Trash2, Mail, Upload, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";


interface AttendeeManagerProps {
  event: Event;
}

function AttendeeRow({ event, registration: initialRegistration, isSelected, onSelectChange }: { event: Event, registration: Registration, isSelected: boolean, onSelectChange: (id: string, checked: boolean) => void }) {
  const [registration, setRegistration] = useState(initialRegistration);
  const [isProcessing, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setRegistration(initialRegistration);
  }, [initialRegistration]);

  const handleAttendanceChange = (attended: boolean) => {
    startTransition(async () => {
      const result = await updateAttendanceAction(event.id, registration.id, attended);
      if (result.success) {
        setRegistration(prev => ({ ...prev, attended }));
        toast({ description: result.message });
      } else {
        toast({ description: result.message, variant: "destructive" });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      if(confirm("Are you sure you want to remove this registration?")) {
        // This action should trigger a re-fetch in the parent, so we don't need to update state here.
        await deleteRegistrationAction(event.id, registration.id);
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadAttendeeCertificateAction(event.id, registration.id, formData);
        if (result.success) {
          toast({ description: result.message });
          // Parent component will re-fetch and update the state.
        } else {
          toast({ description: result.message, variant: "destructive" });
        }
      });
    }
  };
  
  const handleSendEmail = () => {
      if (!registration.certificateUrl) {
          toast({ description: "No certificate uploaded for this attendee.", variant: "destructive" });
          return;
      }
      startTransition(async () => {
          const result = await sendAttendeeCertificateAction(event.id, registration);
           if (result.success) {
              setRegistration(prev => ({ ...prev, certificateSent: true }));
              toast({ description: result.message });
          } else {
              toast({ description: result.message, variant: "destructive" });
          }
      });
  }

  const getStatus = () => {
    if (registration.certificateSent) {
      return <span className="flex items-center text-xs text-green-600"><CheckCircle2 className="h-3 w-3 mr-1"/> Sent</span>;
    }
    if (registration.certificateUrl) {
      return <span className="flex items-center text-xs text-blue-600"><Upload className="h-3 w-3 mr-1"/> Uploaded</span>;
    }
    return <span className="flex items-center text-xs text-muted-foreground"><AlertTriangle className="h-3 w-3 mr-1"/> Not Uploaded</span>;
  };

  return (
    <TableRow data-state={isSelected ? 'selected' : undefined}>
      <TableCell className="py-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectChange(registration.id, !!checked)}
          aria-label="Select row"
        />
      </TableCell>
      <TableCell className="font-medium">
        <div>{registration.studentName}</div>
        <div className="text-xs text-muted-foreground sm:hidden">{registration.studentEmail}</div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground">
        <div>URN: {registration.urn}</div>
        <div>CRN: {registration.crn}</div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Switch
          checked={registration.attended}
          onCheckedChange={handleAttendanceChange}
          disabled={isProcessing}
        />
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start gap-2">
            <div>{getStatus()}</div>
            {registration.certificateUrl && !registration.certificateSent && (
                <a href={registration.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
                    View
                </a>
            )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, application/pdf"
          />
          <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSendEmail} disabled={isProcessing || !registration.certificateUrl || registration.certificateSent}>
            <Send className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isProcessing}>
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}


export function AttendeeManager({ event }: AttendeeManagerProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkSending, startBulkSendTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const addAction = addRegistrationAction.bind(null, event.id);
  const initialState = { message: "", errors: {}, success: false };
  const [state, formAction] = useActionState(addAction, initialState);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    const fetchedRegistrations = await getRegistrationsForEvent(event.id);
    setRegistrations(fetchedRegistrations);
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchRegistrations();
  }, [event.id]);

  useEffect(() => {
    if (state.success) {
      fetchRegistrations(); // Re-fetch on successful addition
    }
  }, [state.success]);

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

  const handleSelectChange = (id: string, checked: boolean) => {
    setSelected(prev => checked ? [...prev, id] : prev.filter(rowId => rowId !== id));
  };
  
  const handleSelectAllChange = (checked: boolean) => {
    setSelected(checked ? registrations.map(r => r.id) : []);
  };

  const handleBulkSend = () => {
    const selectedRegistrations = registrations.filter(r => selected.includes(r.id));
    const toSend = selectedRegistrations.filter(r => r.certificateUrl && !r.certificateSent);

    if(toSend.length === 0) {
        toast({
            title: "No certificates to send",
            description: "Please select attendees who have an uploaded certificate that hasn't been sent yet.",
            variant: "destructive"
        });
        return;
    }

    startBulkSendTransition(async () => {
        const result = await sendBulkCertificatesAction(event.id, toSend);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            setSelected([]);
            fetchRegistrations(); // Refresh data
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    });
  }
  

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Attendance & Certificates</CardTitle>
        <CardDescription>
            Manage student registrations. Mark attendance, then upload and send a unique certificate for each attendee.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg items-end">
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
          
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={formAction.pending} className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Registrant
            </Button>
          </div>
        </form>

        <div className="mb-4 flex items-center gap-4">
          <Button onClick={handleBulkSend} disabled={selected.length === 0 || isBulkSending}>
            {isBulkSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send to Selected ({selected.length})
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] py-2">
                  <Checkbox
                    checked={selected.length > 0 && selected.length === registrations.length}
                    onCheckedChange={handleSelectAllChange}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="hidden sm:table-cell">URN / CRN</TableHead>
                <TableHead className="hidden md:table-cell">Attended</TableHead>
                <TableHead>Certificate Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : registrations.length > 0 ? (
                registrations.map(reg => (
                  <AttendeeRow 
                    key={reg.id} 
                    event={event} 
                    registration={reg} 
                    isSelected={selected.includes(reg.id)}
                    onSelectChange={handleSelectChange}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
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
