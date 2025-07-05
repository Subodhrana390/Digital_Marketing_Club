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

export async function uploadCertificateTemplate(file: File): Promise<{ downloadUrl: string, publicId: string }> {
    checkConfiguration();

    const buffer = Buffer.from(await file.arrayBuffer());
    const response = await uploadStream(buffer, {
        folder: 'certificate-templates',
        resource_type: 'image',
    });

    if (!response || !response.secure_url || !response.public_id) {
        throw new Error('Template upload to Cloudinary failed.');
    }

    return {
        downloadUrl: response.secure_url,
        publicId: response.public_id,
    };
}


export async function generateCertificateWithOverlay({
  templatePublicId,
  studentName,
  eventTitle,
  eventDate,
}: {
  templatePublicId: string;
  studentName:string;
  eventTitle: string;
  eventDate: string; // ISO String
}): Promise<{ certificateUrl: string }> {
    checkConfiguration();
    
    // Sanitize text for URL transformations
    const sanitize = (text: string) => encodeURIComponent(text.replace(/,/g, '\\,').replace(/\//g, '\\/'));

    const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // These are example transformations. You may need to adjust the x, y, font, and size
    // based on your certificate template's design. The 'y' values are offsets from the center.
    const transformations = [
        // Student Name Overlay (centered horizontally, y offset from center)
        {
            overlay: {
                font_family: 'Arial',
                font_size: 80,
                font_weight: 'bold',
                text: sanitize(studentName),
            },
            color: '#374151', // gray-700
            y: 50,
        },
        // Event Title Overlay
        {
            overlay: {
                font_family: 'Arial',
                font_size: 30,
                text: sanitize(`For successfully participating in`),
            },
            color: '#6B7280', // gray-500
            y: 130,
        },
        {
            overlay: {
                font_family: 'Arial',
                font_size: 40,
                font_weight: 'bold',
                text: sanitize(eventTitle),
            },
            color: '#374151', // gray-700
            y: 180,
        },
        // Date Overlay
        {
            overlay: {
                font_family: 'Arial',
                font_size: 25,
                text: sanitize(`Awarded on ${formattedDate}`),
            },
            color: '#6B7280', // gray-500
            y: 250,
        },
    ];

    const certificateUrl = cloudinary.url(templatePublicId, {
        transformation: transformations,
        secure: true,
    });

    if (!certificateUrl) {
        throw new Error('Failed to generate certificate URL from Cloudinary.');
    }

    return { certificateUrl };
}
