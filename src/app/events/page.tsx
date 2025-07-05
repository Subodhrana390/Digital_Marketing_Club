
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getEvents } from "@/services/events";
import type { Event } from "@/lib/types";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          Upcoming Events
        </h1>
        <p className="text-lg text-muted-foreground">
          Join our workshops, webinars, and networking sessions.
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: Event) => (
            <Card key={event.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="line-clamp-3 h-[60px]">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </CardContent>
              <CardFooter>
                {event.registrationLink ? (
                  <Button asChild className="w-full">
                    <Link href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                      Register Now
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    Registration Closed
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <Card>
                <CardContent className="p-8 mt-6">
                    <h2 className="text-xl font-semibold">No Upcoming Events</h2>
                    <p className="text-muted-foreground mt-2">Please check back later for new events.</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
