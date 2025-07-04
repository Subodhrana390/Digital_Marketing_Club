import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ReportCharts } from "@/components/report-charts";
import { getBlogPosts } from "@/services/blogs";
import { getEvents } from "@/services/events";
import { getMembers } from "@/services/members";
import { getResources } from "@/services/resources";

export default async function ReportsPage() {
  const events = await getEvents();
  const blogPosts = await getBlogPosts();
  const members = await getMembers();
  const resources = await getResources();

  const attendanceData = events.map(event => ({
      name: event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title,
      total: Math.floor(Math.random() * (150 - 20 + 1)) + 20 // Random attendance between 20-150
  })).slice(0, 5); // show max 5 events

  const engagementData = [
    { name: "Blog Posts", total: blogPosts.length },
    { name: "Events", total: events.length },
    { name: "Members", total: members.length },
    { name: "Resources", total: resources.length },
  ];


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Analytics and insights for your club's activities.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Attendance</CardTitle>
            <CardDescription>
              A snapshot of recent event attendance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportCharts data={attendanceData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Content & Engagement</CardTitle>
            <CardDescription>
              A summary of content and members across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportCharts data={engagementData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
