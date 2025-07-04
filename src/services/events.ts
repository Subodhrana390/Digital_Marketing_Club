import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Event } from '@/lib/types';

export async function getEvents(): Promise<Event[]> {
    const eventsCollection = collection(db, 'events');
    const q = query(eventsCollection, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            date: data.date.toDate().toISOString(),
            time: data.time,
            location: data.location,
            description: data.description,
        } as Event
    });
}
