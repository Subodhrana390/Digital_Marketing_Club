'use server';
/**
 * @fileOverview A flow that generates blog post content based on a title.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogContentInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
});
export type GenerateBlogContentInput = z.infer<typeof GenerateBlogContentInputSchema>;

const GenerateBlogContentOutputSchema = z.object({
  excerpt: z.string().describe('A short, compelling excerpt for the blog post.'),
  content: z.string().describe('The full content of the blog post in Markdown format.'),
});
export type GenerateBlogContentOutput = z.infer<typeof GenerateBlogContentOutputSchema>;

export async function generateBlogContent(input: GenerateBlogContentInput): Promise<GenerateBlogContentOutput> {
  return generateBlogContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogContentPrompt',
  input: {schema: GenerateBlogContentInputSchema},
  output: {schema: GenerateBlogContentOutputSchema},
  prompt: `You are an expert content writer for a digital marketing blog.
  Given the title "{{title}}", write a compelling blog post.

  The post should be well-structured, informative, and engaging for an audience interested in digital marketing trends.
  
  Please provide the output in the requested JSON format, with a concise excerpt and the full content in Markdown.
  Use rich Markdown formatting, including multiple levels of headings (H2, H3), lists, bold text, links, and tables where appropriate.
  Also include at least one relevant image within the article body using Markdown syntax with a placeholder URL from https://placehold.co (e.g., ![Descriptive alt text](https://placehold.co/800x400.png)). This creates a well-structured and visually engaging article.`,
});

const generateBlogContentFlow = ai.defineFlow(
  {
    name: 'generateBlogContentFlow',
    inputSchema: GenerateBlogContentInputSchema,
    outputSchema: GenerateBlogContentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
