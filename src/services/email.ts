
'use server';

import nodemailer from 'nodemailer';

const fromEmail = process.env.EMAIL_FROM || 'dmc@example.com';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

type Attachment = {
  url: string;
  filename: string;
}

type EmailPayload = {
  to: string;
  studentName: string;
  eventTitle: string;
  attachment?: Attachment;
}

export async function sendCertificateEmail(payloads: EmailPayload[]) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email service is not configured. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS environment variables.");
    throw new Error("Email service is not configured on the server.");
  }
  
  const emailPromises = payloads.map(async (payload) => {
    const { to, studentName, eventTitle, attachment } = payload;
    const emailHtml = CertificateEmailTemplate({ studentName, eventTitle });
    const attachments: any[] = [];

    if (attachment) {
      try {
        const response = await fetch(attachment.url);
        if (!response.ok) {
          console.error(`Failed to fetch certificate from ${attachment.url} for ${studentName}`);
          return; // Skip this email if fetching fails
        }
        const buffer = await response.arrayBuffer();
        attachments.push({
          filename: attachment.filename,
          content: Buffer.from(buffer),
        });
      } catch (error) {
        console.error(`Error fetching or converting attachment for ${studentName}:`, error);
        return;
      }
    }

    const mailOptions = {
        from: `Digital Marketing Club <${fromEmail}>`,
        to: to,
        subject: `Your Certificate for: ${eventTitle}`,
        html: emailHtml,
        attachments: attachments,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        // We don't rethrow here to allow other emails to be sent.
    }
  });

  await Promise.all(emailPromises);

  return { success: true };
}
