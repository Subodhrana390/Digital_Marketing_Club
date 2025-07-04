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
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const events = [
  {
    title: "Digital Marketing 101 Workshop",
    date: "2024-10-15",
    time: "2:00 PM - 4:00 PM",
    location: "Business Building, Room 301",
    description:
      "An introductory workshop covering the fundamentals of digital marketing, from SEO to social media.",
  },
  {
    title: "Guest Speaker: CMO of TechCorp",
    date: "2024-11-02",
    time: "6:00 PM - 7:30 PM",
    location: "Main Auditorium",
    description:
      "Join us for an inspiring talk from the Chief Marketing Officer of TechCorp on the future of AI in marketing.",
  },
  {
    title: "Networking Night & Social",
    date: "2024-11-20",
    time: "7:00 PM onwards",
    location: "Campus Pub",
    description:
      "A casual evening to connect with fellow club members, alumni, and marketing professionals.",
  },
  {
    title: "Advanced SEO Strategies",
    date: "2024-12-05",
    time: "3:00 PM - 5:00 PM",
    location: "Library, Room C",
    description:
      "A deep dive into advanced SEO techniques, including technical SEO, link building, and content strategy.",
  },
];

export default function AdminEventsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Events</CardTitle>
            <CardDescription>Manage your club's events.</CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Event
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.title}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>{event.time}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}