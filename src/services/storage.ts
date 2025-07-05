'use server';

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function uploadStream(buffer: Buffer, options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
}

function checkConfiguration() {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error("Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.");
    }
}

export async function uploadEventReport(file: File): Promise<{ downloadUrl: string, fileName: string }> {
  checkConfiguration();
  
  const buffer = Buffer.from(await file.arrayBuffer());

  const response = await uploadStream(buffer, {
    folder: 'event-reports',
    resource_type: 'auto',
    public_id: file.name.split('.')[0] + '_' + Date.now(),
  });

  if (!response || !response.secure_url) {
      throw new Error('File upload to Cloudinary failed, no secure URL returned.');
  }

  return {
      downloadUrl: response.secure_url,
      fileName: file.name
  };
}


export async function uploadCertificate(
  dataUri: string,
  eventId: string,
  registrationId: string
): Promise<{ downloadUrl: string }> {
  checkConfiguration();

  const response = await cloudinary.uploader.upload(dataUri, {
    folder: `certificates/${eventId}`,
    public_id: registrationId,
    overwrite: true,
    resource_type: 'image',
  });
  
  if (!response || !response.secure_url) {
      throw new Error('Certificate upload to Cloudinary failed, no secure URL returned.');
  }

  return {
    downloadUrl: response.secure_url,
  };
}
