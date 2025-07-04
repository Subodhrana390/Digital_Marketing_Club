import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
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

export async function getEvent(id: string): Promise<Event | null> {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        date: data.date.toDate().toISOString(),
    } as Event;
}


export async function addEvent(event: Omit<Event, 'id'>) {
    const newEvent = {
        ...event,
        date: Timestamp.fromDate(new Date(event.date)),
    };
    const docRef = await addDoc(collection(db, 'events'), newEvent);
    return docRef.id;
}

export async function updateEvent(id: string, event: Partial<Omit<Event, 'id'>>) {
    const eventData: Partial<any> = {...event};
    if (event.date) {
        eventData.date = Timestamp.fromDate(new Date(event.date));
    }
    await updateDoc(doc(db, 'events', id), eventData);
}

export async function deleteEvent(id: string) {
    await deleteDoc(doc(db, 'events', id));
}
