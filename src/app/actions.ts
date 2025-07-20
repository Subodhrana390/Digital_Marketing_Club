
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  suggestBlogTitles,
  type SuggestBlogTitlesInput,
  type SuggestBlogTitlesOutput,
} from "@/ai/flows/suggest-blog-titles";
import {
  generateBlogContent,
  type GenerateBlogContentInput,
  type GenerateBlogContentOutput,
} from "@/ai/flows/generate-blog-content";
import { addBlogPost, deleteBlogPost, updateBlogPost } from "@/services/blogs";
import { addEvent, deleteEvent, updateEvent, addRegistrationToEvent, updateRegistrationForEvent, deleteRegistrationFromEvent, getEvent, getRegistrationsForEvent } from "@/services/events";
import { addResource, deleteResource, updateResource } from "@/services/resources";
import { addMember, deleteMember, updateMember, addMemberRegistration, updateMemberRegistrationStatus } from "@/services/members";
import { uploadEventReport, uploadImage, deleteFileByPublicId, uploadAttendeeCertificate as uploadAttendeeCertificateToStorage } from "@/services/storage";
import { sendCertificateEmail } from "@/services/email";
import { addContactSubmission, deleteContactSubmission } from "@/services/contact";
import { addTestimonial, deleteTestimonial, updateTestimonial } from "@/services/testimonials";
import type { BlogPost, Event, Member, Resource, MemberRegistration, Testimonial, Registration } from "@/lib/types";


const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors and try again.",
    };
  }
  
  try {
    await addContactSubmission(validatedFields.data);
    return {
      message: "Thank you! Your message has been sent.",
      errors: {},
      reset: true,
    };
  } catch (e: any) {
    return {
      message: "An error occurred while sending your message. Please try again later.",
      errors: {},
      reset: false,
    };
  }
}


const ideationSchema = z.object({
  keywords: z.string().min(3, { message: "Please enter at least one keyword." }),
});

type IdeationState = {
  titles: string[];
  error: string | null;
}

export async function getSuggestedTitles(
  prevState: IdeationState,
  formData: FormData
): Promise<IdeationState> {
  const keywords = formData.get("keywords") as string;
  const validatedFields = ideationSchema.safeParse({ keywords });

  if (!validatedFields.success) {
    return {
      titles: [],
      error: validatedFields.error.flatten().fieldErrors.keywords?.[0] || 'Invalid input.',
    };
  }

  try {
    const input: SuggestBlogTitlesInput = { keywords: validatedFields.data.keywords };
    const result: SuggestBlogTitlesOutput = await suggestBlogTitles(input);
    return {
      titles: result.titles,
      error: null,
    };
  } catch (e) {
    console.error(e);
    return {
      titles: [],
      error: "An error occurred while generating titles. Please try again.",
    };
  }
}

// Image Upload Action
export async function uploadImageAction(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "general";

  if (!file) {
    return { url: null, error: "No file provided." };
  }

  try {
    const { downloadUrl } = await uploadImage(file, folder);
    return { url: downloadUrl, error: null };
  } catch (e: any) {
    console.error("Image upload failed:", e);
    return { url: null, error: "Failed to upload image: " + e.message };
  }
}

// Blog Post Actions
export async function generateBlogPostContentAction(
  title: string
): Promise<{ data: GenerateBlogContentOutput | null; error: string | null }> {
  if (!title) {
    return { data: null, error: "Title is required to generate content." };
  }
  try {
    const input: GenerateBlogContentInput = { title };
    const content = await generateBlogContent(input);
    return { data: content, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error: "Failed to generate blog content. Please try again.",
    };
  }
}

type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
}

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  category: z.string().min(3, "Category is required."),
  author: z.string().min(2, "Author is required."),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters."),
  content: z.string().min(50, "Content must be at least 50 characters."),
  imageUrl: z.string().url("Please enter a valid image URL."),
  imageHint: z.string().optional(),
});

function calculateReadTime(content: string): number {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

export async function addBlogPostAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = blogPostSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const readTime = calculateReadTime(validatedFields.data.content);
    await addBlogPost({ ...validatedFields.data, readTime });
  } catch (e: any) {
    console.error(e);
    return { message: "Failed to create blog post: " + e.message, errors: {} };
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  redirect("/admin/blogs");
}

export async function updateBlogPostAction(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = blogPostSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const readTime = calculateReadTime(validatedFields.data.content);
    await updateBlogPost(id, { ...validatedFields.data, readTime });
  } catch (e: any) {
    console.error(e);
    return { message: "Failed to update blog post: " + e.message, errors: {} };
  }

  revalidatePath("/admin/blogs");
  revalidatePath(`/blog/${validatedFields.data.slug}`);
  redirect("/admin/blogs");
}

export async function deleteBlogPostAction(id: string) {
    try {
        await deleteBlogPost(id);
        revalidatePath("/admin/blogs");
        revalidatePath("/blog");
        return { message: "Blog post deleted successfully." };
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to delete blog post: " + e.message };
    }
}

// Event Actions
const eventSchema = z.object({
    title: z.string().min(5, "Title is required."),
    date: z.coerce.date({ required_error: "Date is required." })
      .refine(d => d instanceof Date && !isNaN(d.getTime()), { message: "Please enter a valid date." }),
    time: z.string().min(1, "Time is required."),
    location: z.string().min(3, "Location is required."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    session: z.string().min(1, "Session is required."),
    registrationLink: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    bannerUrl: z.string().url("Please enter a valid banner URL.").optional().or(z.literal('')),
    bannerHint: z.string().optional(),
    photos: z.string().optional(),
    featured: z.preprocess((val) => val === 'on', z.boolean()).optional(),
});

export async function addEventAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = eventSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: "Please correct the errors below.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    try {
        const { photos, ...rest } = validatedFields.data;
        const eventData = {
            ...rest,
            photos: photos ? photos.split(/,|\n/).map(p => p.trim()).filter(p => p) : [],
        };
        await addEvent(eventData);
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to create event: " + e.message, errors: {} };
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    redirect("/admin/events");
}

export async function updateEventAction(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = eventSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: "Please correct the errors below.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const { photos, ...rest } = validatedFields.data;
        const eventData = {
            ...rest,
            featured: rest.featured ?? false,
            photos: photos ? photos.split(/,|\n/).map(p => p.trim()).filter(p => p) : [],
        };
        await updateEvent(id, eventData);
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to update event: " + e.message, errors: {} };
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${id}`);
    redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
    try {
        const event = await getEvent(id);
        if (event?.reportUrl && event.reportName) {
            // Extract public ID from URL to delete from Cloudinary
            const publicIdWithFolder = 'event-reports/' + event.reportName.split('.')[0];
            await deleteFileByPublicId(publicIdWithFolder);
        }

        await deleteEvent(id);
        revalidatePath("/admin/events");
        revalidatePath("/events");
        revalidatePath("/admin/event-reports");
        return { message: "Event and associated report deleted successfully." };
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to delete event: " + e.message };
    }
}


export async function uploadEventReportAction(formData: FormData): Promise<{ downloadUrl: string; fileName: string; error?: string }> {
    const file = formData.get('file') as File | null;

    if (!file) {
        return { downloadUrl: '', fileName: '', error: 'No file provided.' };
    }
    
    try {
        const { downloadUrl, fileName } = await uploadEventReport(file);
        return { downloadUrl, fileName };
    } catch (e: any) {
        console.error("File upload failed:", e);
        return { downloadUrl: '', fileName: '', error: "Failed to upload file: " + e.message };
    }
}

export async function updateEventWithReport(eventId: string, reportUrl: string, reportName: string) {
    try {
        await updateEvent(eventId, { reportUrl, reportName });
        revalidatePath(`/admin/events/edit/${eventId}`);
        revalidatePath('/admin/events');
        revalidatePath('/admin/event-reports');
        return { success: true, message: "Report uploaded successfully." };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: "Failed to update event with report: " + e.message };
    }
}

// Event Registration Actions
const registrationSchema = z.object({
  studentName: z.string().min(2, "Name is required."),
  studentEmail: z.string().email("A valid email is required."),
  branch: z.string().min(2, "Branch is required."),
  mobileNumber: z.string().min(10, "A valid mobile number is required."),
  year: z.enum(["1st", "2nd", "3rd", "4th"]),
  urn: z.string().min(1, "URN is required."),
  crn: z.string().min(1, "CRN is required."),
});

export async function addRegistrationAction(eventId: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = registrationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    await addRegistrationToEvent(eventId, validatedFields.data);
    revalidatePath(`/admin/events/edit/${eventId}`);
    revalidatePath(`/events/${eventId}`);
    return { message: "You have been registered successfully!", errors: {}, success: true };
  } catch (e: any) {
    return { message: "Failed to register student: " + e.message, errors: {}, success: false };
  }
}

export async function updateAttendanceAction(eventId: string, registrationId: string, attended: boolean) {
  try {
    await updateRegistrationForEvent(eventId, registrationId, { attended });
    revalidatePath(`/admin/events/edit/${eventId}`);
    return { success: true, message: "Attendance updated." };
  } catch (e: any) {
    return { success: false, message: "Failed to update attendance: " + e.message };
  }
}

export async function deleteRegistrationAction(eventId: string, registrationId: string) {
    try {
        await deleteRegistrationFromEvent(eventId, registrationId);
        revalidatePath(`/admin/events/edit/${eventId}`);
        return { success: true, message: "Registration removed." };
    } catch (e: any) {
        return { success: false, message: "Failed to remove registration: " + e.message };
    }
}

export async function uploadAttendeeCertificateAction(
  eventId: string,
  registrationId: string,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, message: "No file provided." };
  }

  try {
    const { downloadUrl, fileName } = await uploadAttendeeCertificateToStorage(file);
    await updateRegistrationForEvent(eventId, registrationId, {
      certificateUrl: downloadUrl,
      certificateName: fileName,
      certificateSent: false, // Reset sent status on new upload
    });
    revalidatePath(`/admin/events/edit/${eventId}`);
    return { success: true, message: "Certificate uploaded." };
  } catch (e: any) {
    return { success: false, message: "Failed to upload certificate: " + e.message };
  }
}

export async function sendAttendeeCertificateAction(
  eventId: string,
  registration: Registration
): Promise<{ success: boolean; message: string }> {
  if (!registration.certificateUrl || !registration.certificateName) {
    return { success: false, message: "No certificate found for this attendee." };
  }

  try {
    const event = await getEvent(eventId);
    if (!event) throw new Error("Event not found.");

    const response = await fetch(registration.certificateUrl);
    if (!response.ok) throw new Error("Could not fetch the certificate file.");
    const fileBuffer = await response.arrayBuffer();

    const certificateAttachment = {
      filename: registration.certificateName,
      content: Buffer.from(fileBuffer),
    };

    await sendCertificateEmail([
      {
        to: registration.studentEmail,
        studentName: registration.studentName,
        eventTitle: event.title,
        attachments: [certificateAttachment],
      },
    ]);

    // Update the registration to mark the certificate as sent
    await updateRegistrationForEvent(eventId, registration.id, { certificateSent: true });

    revalidatePath(`/admin/events/edit/${eventId}`);
    return { success: true, message: `Certificate sent to ${registration.studentName}.` };
  } catch (e: any) {
    return { success: false, message: "Failed to send certificate: " + e.message };
  }
}

export async function sendBulkCertificatesAction(
    eventId: string,
    registrations: Registration[]
): Promise<{ success: boolean; message: string }> {
    const event = await getEvent(eventId);
    if (!event) return { success: false, message: "Event not found." };

    const emailsToSend = [];
    const successfulSends: string[] = [];

    for (const reg of registrations) {
        if (reg.certificateUrl && reg.certificateName && !reg.certificateSent) {
            try {
                const response = await fetch(reg.certificateUrl);
                if (!response.ok) throw new Error(`Could not fetch file for ${reg.studentName}`);
                const fileBuffer = await response.arrayBuffer();
                
                emailsToSend.push({
                    to: reg.studentEmail,
                    studentName: reg.studentName,
                    eventTitle: event.title,
                    attachments: [{
                        filename: reg.certificateName,
                        content: Buffer.from(fileBuffer),
                    }]
                });
                successfulSends.push(reg.id);
            } catch (error) {
                console.error(`Failed to prepare email for ${reg.studentName}:`, error);
            }
        }
    }

    if (emailsToSend.length === 0) {
        return { success: true, message: "No new certificates to send." };
    }

    try {
        await sendCertificateEmail(emailsToSend);
        
        // Update the sent status for all successfully sent emails
        for (const regId of successfulSends) {
            await updateRegistrationForEvent(eventId, regId, { certificateSent: true });
        }

        revalidatePath(`/admin/events/edit/${eventId}`);
        return { success: true, message: `Successfully sent ${successfulSends.length} of ${registrations.length} selected certificates.` };
    } catch (error: any) {
        return { success: false, message: `Failed to send emails: ${error.message}` };
    }
}


// Resource Actions
const resourceSchema = z.object({
    name: z.string().min(3, "Name is required."),
    url: z.string().url("Please enter a valid URL."),
    category: z.enum(["Tool", "Template", "Learning"], { required_error: "Category is required." }),
});

export async function addResourceAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = resourceSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: "Please correct the errors below.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await addResource(validatedFields.data as Omit<Resource, 'id'>);
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to create resource: " + e.message, errors: {} };
    }

    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    redirect("/admin/resources");
}

export async function updateResourceAction(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = resourceSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: "Please correct the errors below.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await updateResource(id, validatedFields.data);
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to update resource: " + e.message, errors: {} };
    }

    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    redirect("/admin/resources");
}

export async function deleteResourceAction(id: string) {
    try {
        await deleteResource(id);
        revalidatePath("/admin/resources");
        revalidatePath("/resources");
        return { message: "Resource deleted successfully." };
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to delete resource: " + e.message };
    }
}

// Member Actions
const memberSchema = z.object({
    name: z.string().min(2, "Name is required."),
    role: z.string().min(2, "Role is required."),
    session: z.string().min(1, "Session is required."),
    branch: z.string().optional().or(z.literal('')),
    urn: z.string().optional().or(z.literal('')),
    crn: z.string().optional().or(z.literal('')),
    type: z.enum(["Core", "Active", "Faculty"], { required_error: "Member type is required." }),
    avatarUrl: z.string().optional(),
    avatarHint: z.string().optional(),
    skills: z.string().min(1, "At least one skill is required."),
    description: z.string().min(10, "Description must be at least 10 characters.").optional().or(z.literal('')),
    linkedinUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    githubUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    googleUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
}).refine(data => data.type === 'Active' || (data.type !== 'Active' && data.avatarUrl && data.avatarUrl.length > 0), {
    message: "Avatar is required for Core and Faculty members.",
    path: ["avatarUrl"],
});


export async function addMemberAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = memberSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: "Please correct the errors below.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { skills, ...rest } = validatedFields.data;
    const memberData: Omit<Member, 'id' | 'fallback'> = {
        ...rest,
        avatarUrl: rest.avatarUrl || '',
        skills: skills.split(',').map(s => s.trim()),
    };
    
    try {
        await addMember(memberData);
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to add member: " + e.message, errors: {} };
    }

    revalidatePath("/admin/members");
    revalidatePath("/members");
    redirect("/admin/members");
}

export async function updateMemberAction(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = memberSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: "Please correct the errors below.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { skills, ...rest } = validatedFields.data;
    const memberData = {
        ...rest,
        avatarUrl: rest.avatarUrl || '',
        skills: skills.split(',').map(s => s.trim()),
    };

    try {
        await updateMember(id, memberData);
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to update member: " + e.message, errors: {} };
    }

    revalidatePath("/admin/members");
    revalidatePath("/members");
    redirect("/admin/members");
}

export async function deleteMemberAction(id: string) {
    try {
        await deleteMember(id);
        revalidatePath("/admin/members");
        revalidatePath("/members");
        return { message: "Member removed successfully." };
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to remove member: " + e.message };
    }
}


export async function addMemberRegistrationAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = registrationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    await addMemberRegistration(validatedFields.data);
    revalidatePath(`/admin/registrations`);
    return { message: "Your application has been submitted successfully! We will get back to you soon.", errors: {}, success: true };
  } catch (e: any) {
    return { message: "Failed to submit application: " + e.message, errors: {}, success: false };
  }
}

export async function approveMemberRegistrationAction(registration: MemberRegistration) {
    try {
        // Step 1: Add the user as an Active Member
        const currentYear = new Date().getFullYear();
        const session = `${currentYear}-${currentYear + 1}`;
        
        await addMember({
            name: registration.studentName,
            role: "Member",
            type: "Active",
            session: session,
            branch: registration.branch,
            urn: registration.urn,
            crn: registration.crn,
            skills: ['New Member'],
            avatarUrl: '',
        });

        // Step 2: Update the registration status
        await updateMemberRegistrationStatus(registration.id, 'approved');

        revalidatePath("/admin/registrations");
        revalidatePath("/admin/members");
        revalidatePath("/members/active");

        return { success: true, message: `${registration.studentName} has been approved and added as an Active Member.` };

    } catch (e: any) {
        console.error(e);
        return { success: false, message: "Failed to approve member: " + e.message };
    }
}

export async function rejectMemberRegistrationAction(id: string) {
    try {
        await updateMemberRegistrationStatus(id, 'rejected');
        revalidatePath("/admin/registrations");
        return { success: true, message: "Registration has been rejected." };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: "Failed to reject member: " + e.message };
    }
}

// Contact Submission Actions
export async function deleteContactSubmissionAction(id: string) {
    try {
        await deleteContactSubmission(id);
        revalidatePath("/admin/contacts");
        return { message: "Contact submission deleted successfully." };
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to delete contact submission: " + e.message };
    }
}

// Testimonial Actions
const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required."),
  role: z.string().min(2, "Role is required."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  avatarUrl: z.string().url("Please upload or provide a valid avatar URL."),
  avatarHint: z.string().optional(),
});

export async function addTestimonialAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = testimonialSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addTestimonial(validatedFields.data as Omit<Testimonial, 'id'>);
  } catch (e: any) {
    console.error(e);
    return { message: "Failed to create testimonial: " + e.message, errors: {} };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = testimonialSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await updateTestimonial(id, validatedFields.data);
  } catch (e: any) {
    console.error(e);
    return { message: "Failed to update testimonial: " + e.message, errors: {} };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(id: string) {
    try {
        await deleteTestimonial(id);
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { message: "Testimonial deleted successfully." };
    } catch (e: any) {
        console.error(e);
        return { message: "Failed to delete testimonial: " + e.message };
    }
}
