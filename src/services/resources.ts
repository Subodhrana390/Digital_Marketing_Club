import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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
