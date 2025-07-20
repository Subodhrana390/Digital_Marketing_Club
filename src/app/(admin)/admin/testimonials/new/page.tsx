import { TestimonialForm } from "@/components/testimonial-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewTestimonialPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Testimonial</CardTitle>
                <CardDescription>Fill out the form below to add a new testimonial.</CardDescription>
            </CardHeader>
            <CardContent>
                <TestimonialForm />
            </CardContent>
        </Card>
    )
}
