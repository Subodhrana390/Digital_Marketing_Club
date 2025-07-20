import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/testimonial-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTestimonial } from "@/services/testimonials";

interface EditTestimonialPageProps {
  params: {
    id: string;
  };
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
    const testimonial = await getTestimonial(params.id);

    if (!testimonial) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Testimonial</CardTitle>
                <CardDescription>Update the details of the testimonial below.</CardDescription>
            </CardHeader>
            <CardContent>
                <TestimonialForm testimonial={testimonial} />
            </CardContent>
        </Card>
    )
}
