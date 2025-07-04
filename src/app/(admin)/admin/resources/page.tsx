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

const resources = {
  tools: [
    { name: "Google Analytics", url: "https://analytics.google.com/" },
    { name: "HubSpot", url: "https://www.hubspot.com/" },
    { name: "Canva", url: "https://www.canva.com/" },
    { name: "SEMrush", url: "https://www.semrush.com/" },
  ],
  templates: [
    { name: "Social Media Calendar Template", url: "#" },
    { name: "Marketing Report Template", url: "#" },
    { name: "Email Campaign Template", url: "#" },
  ],
  learning: [
    {
      name: "Google Digital Garage",
      url: "https://learndigital.withgoogle.com/digitalgarage/",
    },
    { name: "HubSpot Academy", url: "https://academy.hubspot.com/" },
    { name: "Neil Patel's Blog", url: "https://neilpatel.com/blog/" },
  ],
};

const allResources = [
  ...resources.tools.map((r) => ({ ...r, category: "Tool" })),
  ...resources.templates.map((r) => ({ ...r, category: "Template" })),
  ...resources.learning.map((r) => ({ ...r, category: "Learning" })),
];

export default function AdminResourcesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              Manage your club's resource library.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Resource
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">URL</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allResources.map((resource) => (
              <TableRow key={resource.name}>
                <TableCell className="font-medium">{resource.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{resource.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {resource.url}
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