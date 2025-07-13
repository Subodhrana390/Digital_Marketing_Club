
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function MemberRegistrationsPage() {
  const registrations = await getMemberRegistrations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Registrations</CardTitle>
        <CardDescription>
          Review and manage new member applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((reg) => {
              return (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.studentName}</TableCell>
                  <TableCell>{reg.studentEmail}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(reg.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={reg.status === 'pending' ? 'secondary' : 'default'}>
                      {reg.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                       Review
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
             {registrations.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No new member registrations yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
