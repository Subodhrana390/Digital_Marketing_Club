import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Users } from "lucide-react";
import { getEvents } from "@/services/events";
import EventActions from "@/components/admin/event-actions";
import { Badge } from "@/components/ui/badge";


export default async function AdminEventsPage() {
    const events = await getEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Events</CardTitle>
            <CardDescription>Manage your club's events.</CardDescription>
          </div>
          <Button asChild size="sm" className="gap-1">
            <Link href="/admin/events/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Event
              </span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Registrations</TableHead>
              <TableHead className="hidden md:table-cell">Report</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < today;
              
              return (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                    <Badge variant={isPast ? "secondary" : "default"}>
                        {isPast ? "Past" : "Upcoming"}
                    </Badge>
                </TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="hidden md:table-cell">{event.location}</TableCell>
                <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.registrationCount ?? 0}</span>
                    </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {event.reportUrl ? (
                    <a
                      href={event.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary/80"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <EventActions eventId={event.id} />
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
