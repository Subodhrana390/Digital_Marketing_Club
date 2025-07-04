import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

const events = [
  {
    title: "Digital Marketing 101 Workshop",
    date: "2024-10-15",
    time: "2:00 PM - 4:00 PM",
    location: "Business Building, Room 301",
    description: "An introductory workshop covering the fundamentals of digital marketing, from SEO to social media.",
  },
  {
    title: "Guest Speaker: CMO of TechCorp",
    date: "2024-11-02",
    time: "6:00 PM - 7:30 PM",
    location: "Main Auditorium",
    description: "Join us for an inspiring talk from the Chief Marketing Officer of TechCorp on the future of AI in marketing.",
  },
  {
    title: "Networking Night & Social",
    date: "2024-11-20",
    time: "7:00 PM onwards",
    location: "Campus Pub",
    description: "A casual evening to connect with fellow club members, alumni, and marketing professionals.",
  },
  {
    title: "Advanced SEO Strategies",
    date: "2024-12-05",
    time: "3:00 PM - 5:00 PM",
    location: "Library, Room C",
    description: "A deep dive into advanced SEO techniques, including technical SEO, link building, and content strategy.",
  },
];

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Upcoming Events</h1>
        <p className="text-lg text-muted-foreground">
          Join us for our upcoming workshops, talks, and networking opportunities.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.title} className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription className="pt-2">{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
              <Button className="w-full bg-primary/90 hover:bg-primary">Register Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
