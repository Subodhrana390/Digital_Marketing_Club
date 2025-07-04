import { notFound } from "next/navigation";
import { EventForm } from "@/components/event-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getEvent } from "@/services/events";

interface EditEventPageProps {
  params: {
    id: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const event = await getEvent(params.id);

    if (!event) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Event</CardTitle>
                <CardDescription>Update the details of your event below.</CardDescription>
            </CardHeader>
            <CardContent>
                <EventForm event={event} />
            </CardContent>
        </Card>
    )
}
