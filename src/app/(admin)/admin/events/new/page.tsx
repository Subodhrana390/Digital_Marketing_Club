import { EventForm } from "@/components/event-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewEventPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Event</CardTitle>
                <CardDescription>Fill out the form below to create a new event.</CardDescription>
            </CardHeader>
            <CardContent>
                <EventForm />
            </CardContent>
        </Card>
    )
}
