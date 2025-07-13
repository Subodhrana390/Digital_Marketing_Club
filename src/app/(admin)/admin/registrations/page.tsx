
import { getMemberRegistrations } from "@/services/members";
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
import { ReviewRegistration } from "@/components/admin/review-registration";

export default async function MemberRegistrationsPage() {
  const registrations = await getMemberRegistrations();
  const pendingRegistrations = registrations.filter(r => r.status === 'pending');
  const processedRegistrations = registrations.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Member Registrations</CardTitle>
          <CardDescription>
            Review and manage new member applications that are awaiting approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRegistrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.studentName}</TableCell>
                  <TableCell className="hidden md:table-cell">{reg.studentEmail}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(reg.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                      <ReviewRegistration registration={reg} />
                  </TableCell>
                  <TableCell className="text-right">
                     <ReviewRegistration registration={reg} isButton={true} />
                  </TableCell>
                </TableRow>
              ))}
              {pendingRegistrations.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                          No pending member registrations.
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Processed Registrations</CardTitle>
          <CardDescription>
            A history of all approved and rejected applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedRegistrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.studentName}</TableCell>
                  <TableCell className="hidden md:table-cell">{reg.studentEmail}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(reg.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <ReviewRegistration registration={reg} />
                  </TableCell>
                </TableRow>
              ))}
              {processedRegistrations.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                          No processed registrations yet.
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
