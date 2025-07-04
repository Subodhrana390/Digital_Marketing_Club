"use client";

import { useActionState, useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { addEventAction, updateEventAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

      <div className="flex justify-end">
        <SubmitButton isUpdate={isUpdate} />
      </div>
      {state.message && (!state.errors || Object.keys(state.errors).length === 0) && <p className="text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
