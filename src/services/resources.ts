import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, type DocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Resource } from '@/lib/types';

function docToResource(doc: DocumentSnapshot<DocumentData>): Resource | null {
    const data = doc.data();
    const category = data?.category;
    const isValidCategory = category === 'Tool' || category === 'Template' || category === 'Learning';
    
    // Validate required fields
    if (
        !data ||
        typeof data.name !== 'string' ||
        typeof data.url !== 'string' ||
        !isValidCategory
    ) {
        console.error("Invalid or incomplete resource data for doc ID:", doc.id);
        return null;
    }

    return {
        id: doc.id,
        name: data.name,
        url: data.url,
        category: data.category,
    };
}

export async function getResources(): Promise<Resource[]> {
    if (!db) return [];
    const resourcesCollection = collection(db, 'resources');
     const q = query(resourcesCollection, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToResource).filter((resource): resource is Resource => resource !== null);
}

export async function getResource(id: string): Promise<Resource | null> {
    if (!db) return null;
    const docRef = doc(db, 'resources', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return docToResource(docSnap);
}

export async function addResource(resource: Omit<Resource, 'id'>) {
    if (!db) throw new Error("Firebase not initialized");
    const docRef = await addDoc(collection(db, 'resources'), resource);
    return docRef.id;
}

export async function updateResource(id: string, resource: Partial<Omit<Resource, 'id'>>) {
    if (!db) throw new Error("Firebase not initialized");
    await updateDoc(doc(db, 'resources', id), resource);
}

export async function deleteResource(id: string) {
    if (!db) throw new Error("Firebase not initialized");
    await deleteDoc(doc(db, 'resources', id));
}
