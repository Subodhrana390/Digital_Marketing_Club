import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp, type DocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Event } from '@/lib/types';

function docToEvent(doc: DocumentSnapshot<DocumentData>): Event | null {
    const data = doc.data();
    // Validate required fields
    if (
        !data ||
        !(data.date instanceof Timestamp) ||
        typeof data.title !== 'string' ||
        typeof data.time !== 'string' ||
        typeof data.location !== 'string' ||
        typeof data.description !== 'string'
    ) {
        console.error("Invalid or incomplete event data for doc ID:", doc.id);
        return null;
    }

    return {
        id: doc.id,
        title: data.title,
        date: data.date.toDate().toISOString(),
        time: data.time,
        location: data.location,
        description: data.description,
        registrationLink: data.registrationLink,
        reportUrl: data.reportUrl,
        reportName: data.reportName,
    };
}

export async function getEvents(): Promise<Event[]> {
    const eventsCollection = collection(db, 'events');
    const q = query(eventsCollection, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToEvent).filter((event): event is Event => event !== null);
}

export async function getEvent(id: string): Promise<Event | null> {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return docToEvent(docSnap);
}

type EventInput = {
    title: string;
    date: Date;
    time: string;
    location: string;
    description: string;
    registrationLink?: string;
    reportUrl?: string;
    reportName?: string;
}

export async function addEvent(event: Omit<EventInput, 'reportUrl' | 'reportName'>) {
    const newEvent = {
        ...event,
        date: Timestamp.fromDate(event.date),
    };
    const docRef = await addDoc(collection(db, 'events'), newEvent);
    return docRef.id;
}

export async function updateEvent(id: string, event: Partial<EventInput>) {
    const eventData: Partial<any> = {...event};
    if (event.date) {
        eventData.date = Timestamp.fromDate(event.date);
    }
    await updateDoc(doc(db, 'events', id), eventData);
}

export async function deleteEvent(id: string) {
    await deleteDoc(doc(db, 'events', id));
}
