import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Member } from '@/lib/types';

export async function getMembers(): Promise<Member[]> {
    const membersCollection = collection(db, 'members');
    const q = query(membersCollection, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            role: data.role,
            avatarUrl: data.avatarUrl,
            avatarHint: data.avatarHint,
            fallback: data.fallback,
            skills: data.skills,
        } as Member
    });
}

export async function getMember(id: string): Promise<Member | null> {
    const docRef = doc(db, 'members', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return {
        id: docSnap.id,
        ...docSnap.data()
    } as Member;
}


export async function addMember(member: Omit<Member, 'id' | 'fallback'>) {
    const newMember = {
        ...member,
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
