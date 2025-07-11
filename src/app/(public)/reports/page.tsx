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
import { BarChart2, TrendingUp, Zap } from "lucide-react";

export default async function PublicReportsPage() {
  const events = await getEvents();
  const blogPosts = await getBlogPosts();
  const members = await getMembers();
  const resources = await getResources();

  // Using a simplified version of attendance data for public view
  const attendanceData = events
    .map(event => ({
        name: event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title,
        total: event.registrationCount ?? 0
    }))
    .filter(e => e.total > 0) // Only show events with registrations
    .slice(0, 6); // show max 6 events

  const engagementData = [
    { name: "Blog Posts", total: blogPosts.length },
    { name: "Events", total: events.length },
    { name: "Members", total: members.length },
    { name: "Resources", total: resources.length },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
       <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-pink-900/10 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
              <BarChart2 className="h-4 w-4 mr-2 text-green-400" />
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Live Club Analytics
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent font-headline">
              Our Impact in Numbers
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore real-time data on our club's activities, engagement, and growth. 
              We believe in transparency and sharing our progress with the community.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-purple-400" />
                Event Attendance
              </CardTitle>
              <CardDescription className="text-gray-400">
                A snapshot of recent event registrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceData.length > 0 ? (
                <ReportCharts data={attendanceData} />
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No attendance data to display yet.
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl shadow-pink-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Zap className="text-pink-400" />
                 Platform Engagement
              </CardTitle>
              <CardDescription className="text-gray-400">
                A summary of content and members across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
               {engagementData.some(d => d.total > 0) ? (
                <ReportCharts data={engagementData} />
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No engagement data to display yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
