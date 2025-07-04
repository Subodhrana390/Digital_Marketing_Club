
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
import { addEvent, deleteEvent, updateEvent } from "@/services/events";
import { addResource, deleteResource, updateResource } from "@/services/resources";
import { addMember, deleteMember, updateMember } from "@/services/members";
import type { BlogPost, Event, Member, Resource } from "@/lib/types";


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

  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Contact Form Submitted:", validatedFields.data);

  return {
    message: "Thank you! Your message has been sent.",
    errors: {},
    reset: true,
  };
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

export async function addBlogPostAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = blogPostSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addBlogPost(validatedFields.data as Omit<BlogPost, 'id' | 'date'>);
  } catch (e) {
    console.error(e);
    return { message: "Failed to create blog post.", errors: {} };
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
    await updateBlogPost(id, validatedFields.data);
  } catch (e) {
    console.error(e);
    return { message: "Failed to update blog post.", errors: {} };
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
    } catch (e) {
        console.error(e);
        return { message: "Failed to delete blog post." };
    }
}

// Event Actions
const eventSchema = z.object({
    title: z.string().min(5, "Title is required."),
    date: z.coerce.date({ invalid_type_error: "Invalid date format.", required_error: "Date is required." })
      .refine(d => !isNaN(d.getTime()), { message: "Please enter a valid date." }),
    time: z.string().min(1, "Time is required."),
    location: z.string().min(3, "Location is required."),
    description: z.string().min(10, "Description must be at least 10 characters."),
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
        await addEvent(validatedFields.data);
    } catch (e) {
        console.error(e);
        return { message: "Failed to create event.", errors: {} };
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
        await updateEvent(id, validatedFields.data);
    } catch (e) {
        console.error(e);
        return { message: "Failed to update event.", errors: {} };
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
    try {
        await deleteEvent(id);
        revalidatePath("/admin/events");
        revalidatePath("/events");
        return { message: "Event deleted successfully." };
    } catch (e) {
        console.error(e);
        return { message: "Failed to delete event." };
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
    } catch (e) {
        console.error(e);
        return { message: "Failed to create resource.", errors: {} };
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
    } catch (e) {
        console.error(e);
        return { message: "Failed to update resource.", errors: {} };
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
    } catch (e) {
        console.error(e);
        return { message: "Failed to delete resource." };
    }
}

// Member Actions
const memberSchema = z.object({
    name: z.string().min(2, "Name is required."),
    role: z.string().min(2, "Role is required."),
    avatarUrl: z.string().url("Please enter a valid avatar URL."),
    avatarHint: z.string().optional(),
    skills: z.string().min(1, "At least one skill is required."),
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
        skills: skills.split(',').map(s => s.trim()),
    };
    
    try {
        await addMember(memberData);
    } catch (e) {
        console.error(e);
        return { message: "Failed to add member.", errors: {} };
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
        skills: skills.split(',').map(s => s.trim()),
    };

    try {
        await updateMember(id, memberData);
    } catch (e) {
        console.error(e);
        return { message: "Failed to update member.", errors: {} };
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
    } catch (e) {
        console.error(e);
        return { message: "Failed to remove member." };
    }
}
