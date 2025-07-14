import { getContactSubmissions } from "@/services/contact";
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
import ContactActions from "@/components/admin/contact-actions";

export default async function AdminContactsPage() {
  const submissions = await getContactSubmissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
        <CardDescription>
          View all messages submitted through the public contact form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[200px] sm:table-cell">
                Date
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${sub.email}`} className="text-primary hover:underline">
                      {sub.email}
                    </a>
                  </TableCell>
                  <TableCell className="whitespace-pre-wrap">{sub.message}</TableCell>
                  <TableCell>
                      <ContactActions submissionId={sub.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No submissions yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

    