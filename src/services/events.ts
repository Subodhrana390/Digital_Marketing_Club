import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp, type DocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Event, Registration } from '@/lib/types';

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
        certificateTemplateUrl: data.certificateTemplateUrl,
        certificateTemplatePublicId: data.certificateTemplatePublicId,
    };
}

export async function getEvents(): Promise<Event[]> {
    const eventsCollection = collection(db, 'events');
    const q = query(eventsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const eventsPromises = querySnapshot.docs.map(async (eventDoc) => {
        const event = docToEvent(eventDoc);
        if (event) {
            const registrationsCollection = collection(db, 'events', event.id, 'registrations');
            const registrationsSnapshot = await getDocs(registrationsCollection);
            return { ...event, registrationCount: registrationsSnapshot.size };
        }
        return null;
    });

    const eventsWithCount = await Promise.all(eventsPromises);
    return eventsWithCount.filter((event): event is Event => event !== null);
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
    certificateTemplateUrl?: string;
    certificateTemplatePublicId?: string;
}

export async function addEvent(event: Omit<EventInput, 'reportUrl' | 'reportName' | 'certificateTemplateUrl' | 'certificateTemplatePublicId'>) {
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

// Registration functions
function docToRegistration(doc: DocumentSnapshot<DocumentData>): Registration {
    const data = doc.data()!;
    return {
        id: doc.id,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        attended: data.attended || false,
        certificateUrl: data.certificateUrl,
    };
}


export async function getRegistrationsForEvent(eventId: string): Promise<Registration[]> {
    const registrationsCollection = collection(db, 'events', eventId, 'registrations');
    const q = query(registrationsCollection, orderBy('studentName', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToRegistration);
}

export async function addRegistrationToEvent(eventId: string, registration: { studentName: string; studentEmail: string }) {
    const registrationsCollection = collection(db, 'events', eventId, 'registrations');
    await addDoc(registrationsCollection, {
        ...registration,
        attended: false,
    });
}

export async function updateRegistrationForEvent(eventId: string, registrationId: string, data: Partial<Omit<Registration, 'id'>>) {
    const registrationRef = doc(db, 'events', eventId, 'registrations', registrationId);
    await updateDoc(registrationRef, data);
}

export async function deleteRegistrationFromEvent(eventId: string, registrationId: string) {
    const registrationRef = doc(db, 'events', eventId, 'registrations', registrationId);
    await deleteDoc(registrationRef);
}
