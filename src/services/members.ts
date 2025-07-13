import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, type DocumentSnapshot, type DocumentData, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Member, MemberRegistration } from '@/lib/types';

function docToMember(doc: DocumentSnapshot<DocumentData>): Member | null {
    const data = doc.data();
    // Validate required fields
    if (
        !data ||
        typeof data.name !== 'string' ||
        typeof data.role !== 'string' ||
        typeof data.avatarUrl !== 'string' ||
        !Array.isArray(data.skills)
    ) {
        console.error("Invalid or incomplete member data for doc ID:", doc.id);
        return null;
    }

    return {
        id: doc.id,
        name: data.name,
        role: data.role,
        description: data.description, // Optional
        avatarUrl: data.avatarUrl,
        avatarHint: data.avatarHint, // Optional
        fallback: data.name.charAt(0).toUpperCase(),
        skills: data.skills,
        session: data.session, // Optional
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        googleUrl: data.googleUrl,
    };
}

export async function getMembers(): Promise<Member[]> {
    const membersCollection = collection(db, 'members');
    const q = query(membersCollection, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToMember).filter((member): member is Member => member !== null);
}

export async function getMember(id: string): Promise<Member | null> {
    const docRef = doc(db, 'members', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return docToMember(docSnap);
}

export async function addMember(member: Omit<Member, 'id' | 'fallback'>) {
    const newMember = {
        ...member,
        description: member.description || "",
        linkedinUrl: member.linkedinUrl || "",
        githubUrl: member.githubUrl || "",
        googleUrl: member.googleUrl || "",
        fallback: member.name.charAt(0).toUpperCase()
    };
    const docRef = await addDoc(collection(db, 'members'), newMember);
    return docRef.id;
}

export async function updateMember(id: string, member: Partial<Omit<Member, 'id'>>) {
    const memberData: Partial<Member> = {...member};
    if (member.name) {
        memberData.fallback = member.name.charAt(0).toUpperCase();
    }
    await updateDoc(doc(db, 'members', id), memberData);
}

export async function deleteMember(id: string) {
    await deleteDoc(doc(db, 'members', id));
}


// Member Registration Functions
export async function addMemberRegistration(registration: Omit<MemberRegistration, 'id' | 'status' | 'createdAt'>) {
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
    const registrationsCollection = collection(db, 'memberRegistrations');
    const q = query(registrationsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToMemberRegistration).filter((reg): reg is MemberRegistration => reg !== null);
}
