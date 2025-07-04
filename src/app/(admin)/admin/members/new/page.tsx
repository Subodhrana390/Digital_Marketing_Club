import { MemberForm } from "@/components/member-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewMemberPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Member</CardTitle>
                <CardDescription>Fill out the form below to add a new member to the club.</CardDescription>
            </CardHeader>
            <CardContent>
                <MemberForm />
            </CardContent>
        </Card>
    )
}
