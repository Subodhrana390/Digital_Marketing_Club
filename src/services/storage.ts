'use server';

import { google } from 'googleapis';
import { Readable } from 'stream';

function getDriveService() {
    if (!process.env.GCP_PRIVATE_KEY || !process.env.GCP_CLIENT_EMAIL || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
        throw new Error("Google Drive is not configured. Please set GCP_PRIVATE_KEY, GCP_CLIENT_EMAIL, and GOOGLE_DRIVE_FOLDER_ID environment variables.");
    }

    const privateKey = process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GCP_CLIENT_EMAIL,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    return google.drive({ version: 'v3', auth });
}

async function bufferToStream(buffer: Buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

export async function uploadEventReport(file: File): Promise<{ downloadUrl: string, fileName: string }> {
  const drive = getDriveService();
  const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = await bufferToStream(buffer);

  const fileMetadata = {
      name: file.name,
      parents: [FOLDER_ID],
  };

  const media = {
      mimeType: file.type,
      body: stream,
  };

  const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
  });

  const fileId = response.data.id;
  if (!fileId || !response.data.webViewLink) {
      throw new Error('File upload to Google Drive failed, no file ID or link returned.');
  }
  
  await drive.permissions.create({
      fileId: fileId,
      requestBody: {
          role: 'reader',
          type: 'anyone',
      },
  });

  return {
      downloadUrl: response.data.webViewLink,
      fileName: file.name
  };
}


export async function uploadCertificate(
  dataUri: string,
  eventId: string,
  registrationId: string
): Promise<{ downloadUrl: string }> {
  const drive = getDriveService();
  const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;
  
  const buffer = Buffer.from(dataUri.split(',')[1], 'base64');
  const stream = await bufferToStream(buffer);

  const fileName = `${registrationId}.png`;
  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };

  const media = {
    mimeType: 'image/png',
    body: stream,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink',
  });

  const fileId = response.data.id;
  if (!fileId || !response.data.webViewLink) {
      throw new Error('Certificate upload to Google Drive failed, no file ID or link returned.');
  }

  await drive.permissions.create({
      fileId: fileId,
      requestBody: {
          role: 'reader',
          type: 'anyone',
      },
  });

  return {
    downloadUrl: response.data.webViewLink,
  };
}
