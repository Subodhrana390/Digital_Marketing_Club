import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, type DocumentSnapshot, type DocumentData, Timestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Member, MemberRegistration } from '@/lib/types';

function docToMember(doc: DocumentSnapshot<DocumentData>): Member | null {
    const data = doc.data();
    // Validate required fields
    if (
        !data ||
        typeof data.name !== 'string' ||
        typeof data.role !== 'string' ||
        !Array.isArray(data.skills)
    ) {
        console.error("Invalid or incomplete member data for doc ID:", doc.id);
        return null;
    }

    return {
        id: doc.id,
        name: data.name,
        role: data.role,
        type: data.type || 'Core', // Default to 'Core' if not specified
        branch: data.branch,
        urn: data.urn,
        crn: data.crn,
        description: data.description, // Optional
        avatarUrl: data.avatarUrl || "", // Ensure avatarUrl is always a string
        avatarHint: data.avatarHint, // Optional
        fallback: data.name.charAt(0).toUpperCase(),
        skills: data.skills,
        session: data.session, // Optional
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        googleUrl: data.googleUrl,
    };
}

export async function getMembers(type?: 'Core' | 'Active' | 'Faculty'): Promise<Member[]> {
    if (!db) return [];
    const membersCollection = collection(db, 'members');
    
    let q;
    if (type) {
        // Query only by type
        q = query(membersCollection, where('type', '==', type));
    } else {
        q = query(membersCollection, orderBy('name', 'asc'));
    }
    
    const querySnapshot = await getDocs(q);

    const members = querySnapshot.docs.map(docToMember).filter((member): member is Member => member !== null);

    // Sort by name in the application code if we filtered by type
    if (type) {
        members.sort((a, b) => a.name.localeCompare(b.name));
    }

    return members;
}

export async function getMember(id: string): Promise<Member | null> {
    if (!db) return null;
    const docRef = doc(db, 'members', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return docToMember(docSnap);
}

export async function addMember(member: Omit<Member, 'id' | 'fallback'>) {
    if (!db) throw new Error("Firebase not initialized");
    const newMember = {
        ...member,
        description: member.description || "",
        linkedinUrl: member.linkedinUrl || "",
        githubUrl: member.githubUrl || "",
        googleUrl: member.googleUrl || "",
        avatarUrl: member.avatarUrl || "",
        branch: member.branch || "",
        urn: member.urn || "",
        crn: member.crn || "",
    };
    const docRef = await addDoc(collection(db, 'members'), newMember);
    return docRef.id;
}

export async function updateMember(id: string, member: Partial<Omit<Member, 'id' | 'fallback'>>) {
    if (!db) throw new Error("Firebase not initialized");
    const memberData: Partial<Member> = {...member};
    if (member.name) {
        memberData.fallback = member.name.charAt(0).toUpperCase();
    }
    await updateDoc(doc(db, 'members', id), memberData);
}

export async function deleteMember(id: string) {
    if (!db) throw new Error("Firebase not initialized");
    await deleteDoc(doc(db, 'members', id));
}


// Member Registration Functions
export async function addMemberRegistration(registration: Omit<MemberRegistration, 'id' | 'status' | 'createdAt'>) {
    if (!db) throw new Error("Firebase not initialized");
    const registrationsCollection = collection(db, 'memberRegistrations');
    await addDoc(registrationsCollection, {
        ...registration,
        status: 'pending',
        createdAt: Timestamp.now(),
    });
}

function docToMemberRegistration(doc: DocumentSnapshot<DocumentData>): MemberRegistration | null {
    const data = doc.data();
     if (!data || !(data.createdAt instanceof Timestamp)) {
        console.error("Invalid or incomplete member registration data for doc ID:", doc.id);
        return null;
    }
    return {
        id: doc.id,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        branch: data.branch,
        mobileNumber: data.mobileNumber,
        year: data.year,
        urn: data.urn,
        crn: data.crn,
        status: data.status || 'pending',
        createdAt: data.createdAt.toDate().toISOString(),
    };
}

export async function getMemberRegistrations(): Promise<MemberRegistration[]> {
    if (!db) return [];
    const registrationsCollection = collection(db, 'memberRegistrations');
    const q = query(registrationsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToMemberRegistration).filter((reg): reg is MemberRegistration => reg !== null);
}

export async function updateMemberRegistrationStatus(id: string, status: 'approved' | 'rejected') {
    if (!db) throw new Error("Firebase not initialized");
    const registrationRef = doc(db, 'memberRegistrations', id);
    await updateDoc(registrationRef, { status });
}
