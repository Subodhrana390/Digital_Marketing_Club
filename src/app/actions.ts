"use server";

import { z } from "zod";
import {
  suggestBlogTitles,
  type SuggestBlogTitlesInput,
  type SuggestBlogTitlesOutput,
} from "@/ai/flows/suggest-blog-titles";

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

  // Simulate sending data to an API
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
