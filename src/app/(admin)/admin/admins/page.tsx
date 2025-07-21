import { getAdmins } from "@/services/admins";
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
import { AddAdminForm } from "@/components/admin/add-admin-form";

export default async function AdminsPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Admin</CardTitle>
          <CardDescription>
            Grant admin privileges to a user by adding their email address. They
            must have an existing account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddAdminForm />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Admins</CardTitle>
          <CardDescription>
            List of users with administrative access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}