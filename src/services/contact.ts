import { collection, addDoc, Timestamp, getDocs, query, orderBy, type DocumentSnapshot, type DocumentData, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContactSubmission } from '@/lib/types';

type ContactSubmissionInput = Omit<ContactSubmission, 'id' | 'createdAt'>;

export async function addContactSubmission(submission: ContactSubmissionInput) {
    if (!db) throw new Error("Firebase not initialized");
    const newSubmission = {
        ...submission,
        createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'contactSubmissions'), newSubmission);
    return docRef.id;
}

function docToContactSubmission(doc: DocumentSnapshot<DocumentData>): ContactSubmission | null {
    const data = doc.data();
    if (!data || !(data.createdAt instanceof Timestamp)) {
        return null;
    }

    return {
        id: doc.id,
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: data.createdAt.toDate().toISOString(),
    };
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
    if (!db) return [];
    const submissionsCollection = collection(db, 'contactSubmissions');
    const q = query(submissionsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToContactSubmission).filter((sub): sub is ContactSubmission => sub !== null);
}

export async function deleteContactSubmission(id: string) {
    if (!db) throw new Error("Firebase not initialized");
    await deleteDoc(doc(db, 'contactSubmissions', id));
}
