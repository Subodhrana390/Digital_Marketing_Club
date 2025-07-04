import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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
