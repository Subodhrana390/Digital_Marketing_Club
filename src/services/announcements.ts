
import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp, type DocumentSnapshot, type DocumentData, where, writeBatch, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Announcement } from '@/lib/types';

function docToAnnouncement(doc: DocumentSnapshot<DocumentData>): Announcement | null {
    const data = doc.data();
    if (
        !data ||
        typeof data.message !== 'string' ||
        typeof data.isActive !== 'boolean' ||
        !(data.createdAt instanceof Timestamp)
    ) {
        console.error("Invalid or incomplete announcement data for doc ID:", doc.id);
        return null;
    }

    return {
        id: doc.id,
        message: data.message,
        link: data.link || undefined,
        isActive: data.isActive,
        createdAt: data.createdAt.toDate().toISOString(),
    };
}

export async function getAnnouncements(): Promise<Announcement[]> {
    if (!db) return [];
    const announcementsCollection = collection(db, 'announcements');
    const q = query(announcementsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToAnnouncement).filter((a): a is Announcement => a !== null);
}

export async function getActiveAnnouncement(): Promise<Announcement | null> {
    if (!db) return null;
    const announcementsCollection = collection(db, 'announcements');
    const q = query(announcementsCollection, where('isActive', '==', true), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    return docToAnnouncement(querySnapshot.docs[0]);
}

export async function addAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt'>) {
    if (!db) throw new Error("Firebase not initialized");
    
    if (announcement.isActive) {
        // Deactivate all other announcements
        await deactivateAllAnnouncements();
    }

    const newAnnouncement = {
        ...announcement,
        createdAt: Timestamp.now(),
        isActive: announcement.isActive ?? false,
    };
    await addDoc(collection(db, 'announcements'), newAnnouncement);
}

export async function updateAnnouncement(id: string, data: Partial<Omit<Announcement, 'id' | 'createdAt'>>) {
    if (!db) throw new Error("Firebase not initialized");
    
    if (data.isActive) {
        // Deactivate all other announcements
        await deactivateAllAnnouncements(id);
    }
    
    await updateDoc(doc(db, 'announcements', id), data);
}

export async function deleteAnnouncement(id: string) {
    if (!db) throw new Error("Firebase not initialized");
    await deleteDoc(doc(db, 'announcements', id));
}

async function deactivateAllAnnouncements(excludeId?: string) {
    if (!db) throw new Error("Firebase not initialized");
    const batch = writeBatch(db);
    const announcementsCollection = collection(db, 'announcements');
    const q = query(announcementsCollection, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(docSnap => {
        if (docSnap.id !== excludeId) {
            batch.update(docSnap.ref, { isActive: false });
        }
    });

    await batch.commit();
}
