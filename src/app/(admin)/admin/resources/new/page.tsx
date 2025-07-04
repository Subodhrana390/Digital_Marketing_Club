import { ResourceForm } from "@/components/resource-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewResourcePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Resource</CardTitle>
                <CardDescription>Fill out the form below to add a new resource to the library.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResourceForm />
            </CardContent>
        </Card>
    )
}
