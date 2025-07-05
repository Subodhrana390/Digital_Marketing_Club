'use client';

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
