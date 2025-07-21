import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  addDoc,
  where,
  type DocumentSnapshot,
  type DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Admin {
  id: string;
  email: string;
  role: 'admin';
  createdAt: string;
}

function docToAdmin(doc: DocumentSnapshot<DocumentData>): Admin {
  const data = doc.data()!;
  return {
    id: doc.id,
    email: data.email,
    role: data.role,
    createdAt: data.createdAt.toDate().toISOString(),
  };
}

export async function getAdmins(): Promise<Admin[]> {
  if (!db) return [];
  const adminsCollection = collection(db, 'admins');
  const q = query(adminsCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docToAdmin);
}

export async function checkIfUserIsAdmin(email: string): Promise<boolean> {
  if (!db || !email) return false;
  
  const adminsCollection = collection(db, 'admins');
  const q = query(adminsCollection, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  
  return !querySnapshot.empty;
}

export async function addAdmin(email: string): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  
  const adminsCollection = collection(db, 'admins');
  const q = query(adminsCollection, where("email", "==", email));
  const existing = await getDocs(q);

  if (!existing.empty) {
      throw new Error("This email already has admin privileges.");
  }
  
  await addDoc(adminsCollection, {
    email: email,
    role: 'admin',
    createdAt: Timestamp.now(),
  });
}
