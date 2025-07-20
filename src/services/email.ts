
'use server';

import { Resend } from 'resend';
import type { CreateEmailRequest, CreateEmailResponse } from 'resend/build/src/emails/interfaces';

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

interface CertificateEmailProps {
  studentName: string;
  eventTitle: string;
}

const CertificateEmailTemplate = ({ studentName, eventTitle }: CertificateEmailProps): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        background-color: #f4f4f7;
        color: #333;
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border: 1px solid #e2e2e7;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #4A5568; /* primary color */
        color: #ffffff;
        padding: 24px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 32px;
      }
      .content p {
        margin: 0 0 16px;
      }
      .footer {
        background-color: #f4f4f7;
        color: #6b7280;
        text-align: center;
        padding: 20px;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Congratulations, ${studentName}!</h1>
      </div>
      <div class="content">
        <p>Dear ${studentName},</p>
        <p>Thank you for your participation in the "<strong>${eventTitle}</strong>" event. We are pleased to present you with your official certificate of participation.</p>
        <p>You can find your certificate attached to this email.</p>
        <p style="margin-top: 24px;">We appreciate your engagement and hope to see you at our future events!</p>
        <p>Best regards,<br><strong>The Digital Marketing Club</strong></p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Digital Marketing Club. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

type EmailPayload = {
  to: string;
  studentName: string;
  eventTitle: string;
  attachments?: CreateEmailRequest['attachments'];
}

export async function sendCertificateEmail(payloads: EmailPayload[]) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Resend API key is not configured. Please set the RESEND_API_KEY environment variable.");
    throw new Error("Email service is not configured on the server.");
  }
  
  const emails: CreateEmailRequest[] = payloads.map(({ to, studentName, eventTitle, attachments }) => {
      const emailHtml = CertificateEmailTemplate({ studentName, eventTitle });
      return {
          from: `Digital Marketing Club <${fromEmail}>`,
          to: [to],
          subject: `Your Certificate for: ${eventTitle}`,
          html: emailHtml,
          attachments: attachments,
      };
  });


  try {
    const { data, error } = await resend.batch.send(emails);

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(`Failed to send emails: ${error.message}`);
    }

    console.log("Emails sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to execute send email request:", error);
    // Re-throw a generic error to not expose too much detail to the client.
    throw new Error("An unexpected error occurred while trying to send the certificate emails.");
  }
}
