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
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const members = [
  {
    name: "Alex Morgan",
    role: "President",
    avatarUrl: "https://placehold.co/100x100.png",
    fallback: "AM",
    skills: ["Leadership", "Public Speaking", "Strategy"],
  },
  {
    name: "Brenda Chen",
    role: "Vice President, Events",
    avatarUrl: "https://placehold.co/100x100.png",
    fallback: "BC",
    skills: ["Event Planning", "Content Creation", "SEO"],
  },
  {
    name: "Carlos Rodriguez",
    role: "Vice President, Marketing",
    avatarUrl: "https://placehold.co/100x100.png",
    fallback: "CR",
    skills: ["Social Media", "Graphic Design", "PPC"],
  },
  {
    name: "Diana Wells",
    role: "Treasurer",
    avatarUrl: "https://placehold.co/100x100.png",
    fallback: "DW",
    skills: ["Finance", "Analytics", "Email Marketing"],
  },
  {
    name: "Ethan Hunt",
    role: "Member",
    avatarUrl: "https://placehold.co/100x100.png",
    fallback: "EH",
    skills: ["Content Writing", "SEO", "WordPress"],
  },
  {
    name: "Fiona Gallagher",
    role: "Member",
    avatarUrl: "https://placehold.co/100x100.png",
    fallback: "FG",
    skills: ["Videography", "Community Management"],
  },
];

export default function AdminMembersPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              View and manage your club members.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Member
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.name}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{member.fallback}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{member.name}</div>
                  </div>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
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
                      <DropdownMenuItem>Remove</DropdownMenuItem>
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