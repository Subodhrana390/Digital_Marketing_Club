import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, type DocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Testimonial } from '@/lib/types';

function docToTestimonial(doc: DocumentSnapshot<DocumentData>): Testimonial | null {
    const data = doc.data();
    if (
        !data ||
        typeof data.name !== 'string' ||
        typeof data.role !== 'string' ||
        typeof data.quote !== 'string' ||
        typeof data.avatarUrl !== 'string'
    ) {
        console.error("Invalid or incomplete testimonial data for doc ID:", doc.id);
        return null;
    }

    return {
        id: doc.id,
        name: data.name,
        role: data.role,
        quote: data.quote,
        avatarUrl: data.avatarUrl,
        avatarHint: data.avatarHint,
    };
}

export async function getTestimonials(): Promise<Testimonial[]> {
    if (!db) return [];
    const testimonialsCollection = collection(db, 'testimonials');
    const q = query(testimonialsCollection, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToTestimonial).filter((t): t is Testimonial => t !== null);
}

export async function getTestimonial(id: string): Promise<Testimonial | null> {
    if (!db) return null;
    const docRef = doc(db, 'testimonials', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return docToTestimonial(docSnap);
}

export async function addTestimonial(testimonial: Omit<Testimonial, 'id'>) {
    if (!db) throw new Error("Firebase not initialized");
    const docRef = await addDoc(collection(db, 'testimonials'), testimonial);
    return docRef.id;
}

export async function updateTestimonial(id: string, testimonial: Partial<Omit<Testimonial, 'id'>>) {
    if (!db) throw new Error("Firebase not initialized");
    await updateDoc(doc(db, 'testimonials', id), testimonial);
}

export async function deleteTestimonial(id: string) {
    if (!db) throw new Error("Firebase not initialized");
    await deleteDoc(doc(db, 'testimonials', id));
}
