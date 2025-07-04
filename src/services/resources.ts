import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Resource } from '@/lib/types';

export async function getResources(): Promise<Resource[]> {
    const resourcesCollection = collection(db, 'resources');
     const q = query(resourcesCollection, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            url: data.url,
            category: data.category,
        } as Resource
    });
}

export async function getResource(id: string): Promise<Resource | null> {
    const docRef = doc(db, 'resources', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return {
        id: docSnap.id,
        ...docSnap.data()
    } as Resource;
}

export async function addResource(resource: Omit<Resource, 'id'>) {
    const docRef = await addDoc(collection(db, 'resources'), resource);
    return docRef.id;
}

export async function updateResource(id: string, resource: Partial<Omit<Resource, 'id'>>) {
    await updateDoc(doc(db, 'resources', id), resource);
}

export async function deleteResource(id: string) {
    await deleteDoc(doc(db, 'resources', id));
}
