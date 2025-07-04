import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/resource-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getResource } from "@/services/resources";

interface EditResourcePageProps {
  params: {
    id: string;
  };
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
    const resource = await getResource(params.id);

    if (!resource) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Resource</CardTitle>
                <CardDescription>Update the details of the resource below.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResourceForm resource={resource} />
            </CardContent>
        </Card>
    )
}
