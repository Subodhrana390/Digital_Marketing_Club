"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { addEventAction, updateEventAction, updateEventWithReport, uploadEventReportAction, uploadCertificateTemplateAction, updateEventWithTemplate } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendeeManager } from "./attendee-manager";

interface EventFormProps {
  event?: Event | null;
}

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isUpdate ? "Update Event" : "Create Event"}
    </Button>
  );
}

function CertificateTemplateUploader({ event }: { event: Event }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a template image to upload.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResult = await uploadCertificateTemplateAction(formData);

      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      const { downloadUrl, publicId } = uploadResult;
      const result = await updateEventWithTemplate(event.id, downloadUrl, publicId);

      if (result.success) {
        toast({ title: "Success", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setFile(null);
      const fileInput = document.getElementById('template-file') as HTMLInputElement;
      if(fileInput) fileInput.value = "";
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Certificate Template</CardTitle>
        <CardDescription>Upload a template image (e.g., PNG, JPG) for the certificate. The student's name, event title, and date will be overlaid on this image.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.certificateTemplateUrl ? (
          <div className="space-y-2">
            <Label>Current Template</Label>
            <div className="relative w-48 h-auto border rounded-md overflow-hidden">
                <Image src={event.certificateTemplateUrl} alt="Certificate Template" width={200} height={140} className="object-contain" />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No certificate template uploaded yet.</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="template-file">{event.certificateTemplateUrl ? "Upload New/Replace Template" : "Upload Template"}</Label>
          <Input id="template-file" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
        </div>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? "Uploading..." : "Upload Template"}
        </Button>
      </CardContent>
    </Card>
  );
}


function EventReportUploader({ event }: { event: Event }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a file to upload.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResult = await uploadEventReportAction(formData);

      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      const { downloadUrl, fileName } = uploadResult;
      const result = await updateEventWithReport(event.id, downloadUrl, fileName);

      if (result.success) {
        toast({ title: "Success", description: result.message });
        router.refresh();
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setFile(null);
      // Reset the file input visually
      const fileInput = document.getElementById('report-file') as HTMLInputElement;
      if(fileInput) fileInput.value = "";
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Event Report</CardTitle>
        <CardDescription>Upload a report for this event (e.g., PDF, DOCX).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.reportUrl ? (
          <div className="text-sm font-medium">
            Current report:{" "}
            <a href={event.reportUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {event.reportName || 'View Report'}
            </a>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No report uploaded yet.</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="report-file">{event.reportUrl ? "Upload New/Replace Report" : "Upload Report"}</Label>
          <Input id="report-file" type="file" onChange={handleFileChange} />
        </div>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? "Uploading..." : "Upload Report"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function EventForm({ event }: EventFormProps) {
  const isUpdate = !!event;
  const action = isUpdate ? updateEventAction.bind(null, event.id) : addEventAction;
  const [state, formAction] = useActionState(action, { message: "", errors: {} });

  const [date, setDate] = useState<Date | undefined>(
    event ? new Date(event.date) : undefined
  );

  useEffect(() => {
    if (event) {
      setDate(new Date(event.date));
    }
  }, [event]);

  return (
    <>
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={event?.title} required />
        {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input type="hidden" name="date" value={date ? date.toISOString() : ""} />
          {state.errors?.date && <p className="text-sm font-medium text-destructive">{state.errors.date[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" defaultValue={event?.time} placeholder="e.g., 7:00 PM" required />
          {state.errors?.time && <p className="text-sm font-medium text-destructive">{state.errors.time[0]}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" defaultValue={event?.location} placeholder="e.g., Online or Campus Hall" required />
        {state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={event?.description} rows={5} required />
        {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="registrationLink">Registration Link</Label>
        <Input id="registrationLink" name="registrationLink" defaultValue={event?.registrationLink} placeholder="https://example.com/register" />
        {state.errors?.registrationLink && <p className="text-sm font-medium text-destructive">{state.errors.registrationLink[0]}</p>}
      </div>

       <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-medium">Event Visuals</h3>
        <div className="space-y-2">
            <Label htmlFor="bannerUrl">Banner Image URL</Label>
            <Input id="bannerUrl" name="bannerUrl" defaultValue={event?.bannerUrl} placeholder="https://placehold.co/1200x400.png" />
            {state.errors?.bannerUrl && <p className="text-sm font-medium text-destructive">{state.errors.bannerUrl[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="bannerHint">Banner Image Hint (for AI)</Label>
            <Input id="bannerHint" name="bannerHint" defaultValue={event?.bannerHint} placeholder="e.g., people networking" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="photos">Event Photo Gallery URLs</Label>
            <Textarea id="photos" name="photos" defaultValue={event?.photos?.join(', \n')} rows={4} placeholder="Enter image URLs separated by commas or new lines." />
            <p className="text-xs text-muted-foreground">Add multiple URLs for a photo gallery on the event page.</p>
            {state.errors?.photos && <p className="text-sm font-medium text-destructive">{state.errors.photos[0]}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton isUpdate={isUpdate} />
      </div>
      {state.message && (!state.errors || Object.keys(state.errors).length === 0) && <p className="text-sm font-medium text-destructive">{state.message}</p>}
    </form>
    {isUpdate && event && <CertificateTemplateUploader event={event} />}
    {isUpdate && event && <EventReportUploader event={event} />}
    {isUpdate && event && <AttendeeManager event={event} />}
    </>
  );
}
