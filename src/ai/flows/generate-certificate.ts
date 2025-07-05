'use server';
/**
 * @fileOverview A flow that generates a certificate image for an event attendee.
 * 
 * - generateCertificate - A function that handles certificate generation.
 * - GenerateCertificateInput - The input type for the function.
 * - GenerateCertificateOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateCertificateInputSchema = z.object({
  studentName: z.string().describe('The name of the student receiving the certificate.'),
  eventTitle: z.string().describe('The title of the event.'),
});
export type GenerateCertificateInput = z.infer<typeof GenerateCertificateInputSchema>;

export const GenerateCertificateOutputSchema = z.object({
  certificateDataUri: z.string().describe('The generated certificate image as a data URI.'),
});
export type GenerateCertificateOutput = z.infer<typeof GenerateCertificateOutputSchema>;


export async function generateCertificate(input: GenerateCertificateInput): Promise<GenerateCertificateOutput> {
  return generateCertificateFlow(input);
}

const generateCertificateFlow = ai.defineFlow(
  {
    name: 'generateCertificateFlow',
    inputSchema: GenerateCertificateInputSchema,
    outputSchema: GenerateCertificateOutputSchema,
  },
  async ({ studentName, eventTitle }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a professional and elegant certificate of attendance.
      The certificate should be for an event hosted by the "Digital Marketing Club - GNDEC Ludhiana".
      The certificate must prominently feature the text: "Certificate of Attendance".
      It should state: "This certificate is awarded to".
      Below that, display the student's name: "${studentName}".
      It should also state: "For actively participating in the event".
      Below that, display the event title: "${eventTitle}".
      The design should be formal, with a decorative border, possibly in shades of blue and gold, and include a placeholder for a seal or emblem of the club. Do not include placeholders for signatures.
      The overall style should be clean and professional.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
        throw new Error('Failed to generate certificate image.');
    }

    return {
        certificateDataUri: media.url,
    };
  }
);
