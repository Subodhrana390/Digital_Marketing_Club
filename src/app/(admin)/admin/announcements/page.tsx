
import { getAnnouncements } from "@/services/announcements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { AnnouncementList } from "@/components/admin/announcement-list";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Announcement</CardTitle>
          <CardDescription>
            Create a new site-wide announcement. Activating it will display it
            as a banner on all public pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnnouncementForm />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Announcements</CardTitle>
          <CardDescription>
            View, edit, and manage all site announcements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnnouncementList announcements={announcements} />
        </CardContent>
      </Card>
    </div>
  );
}
