import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function uploadEventReport(file: File, eventId: string): Promise<{ downloadUrl: string, fileName: string }> {
  if (!file || !eventId) {
    throw new Error('File and event ID are required.');
  }
  const reportRef = ref(storage, `event-reports/${eventId}/${file.name}`);
  const snapshot = await uploadBytes(reportRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return { downloadUrl, fileName: file.name };
}


export async function uploadCertificate(
  dataUri: string,
  eventId: string,
  registrationId: string
): Promise<{ downloadUrl: string }> {
  if (!dataUri) {
    throw new Error('Data URI is required.');
  }
  // Convert data URI to blob
  const response = await fetch(dataUri);
  const blob = await response.blob();
  
  const certificateRef = ref(storage, `event-certificates/${eventId}/${registrationId}.png`);
  const snapshot = await uploadBytes(certificateRef, blob, { contentType: 'image/png' });
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return { downloadUrl };
}
