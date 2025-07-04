import { notFound } from "next/navigation";
import { MemberForm } from "@/components/member-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getMember } from "@/services/members";

interface EditMemberPageProps {
  params: {
    id: string;
  };
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
    const member = await getMember(params.id);

    if (!member) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Member</CardTitle>
                <CardDescription>Update the details of the club member below.</CardDescription>
            </CardHeader>
            <CardContent>
                <MemberForm member={member} />
            </CardContent>
        </Card>
    )
}
