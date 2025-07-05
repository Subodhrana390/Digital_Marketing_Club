import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { getEvents } from "@/services/events";
import type { Event } from "@/lib/types";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="bg-muted/20">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            Our Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our workshops, webinars, and networking sessions to stay ahead in the digital marketing world.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-1 lg:grid-cols-2">
            {events.map((event: Event) => {
              const eventDate = new Date(event.date);
              const day = eventDate.toLocaleDateString("en-US", { day: "2-digit" });
              const month = eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
              
              return (
              <Card key={event.id} className="flex flex-col sm:flex-row overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group bg-card">
                <div className="flex flex-col items-center justify-center bg-primary/10 p-6 text-center sm:w-32">
                    <span className="text-4xl font-bold text-primary">{day}</span>
                    <span className="text-sm font-medium tracking-wider text-primary/80">{month}</span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                    <div className="flex-grow">
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mb-4 h-[40px]">{event.description}</CardDescription>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>{event.time}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>
                    <CardFooter className="p-0 pt-6">
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
                </div>
              </Card>
            )})}
          </div>
        ) : (
          <div className="text-center py-16">
              <Card className="max-w-lg mx-auto">
                  <CardContent className="p-8 mt-6">
                      <h2 className="text-2xl font-semibold font-headline">No Upcoming Events</h2>
                      <p className="text-muted-foreground mt-2">We're busy planning our next event. Please check back later for exciting updates!</p>
                  </CardContent>
              </Card>
          </div>
        )}
      </div>
    </div>
  );
}
