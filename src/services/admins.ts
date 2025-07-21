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

export async function checkIfUserIsAdmin(uid: string): Promise<boolean> {
  if (!db) return false;
  const adminDocRef = doc(db, 'admins', uid);
  const docSnap = await getDoc(adminDocRef);
  return docSnap.exists() && docSnap.data().role === 'admin';
}

export async function addAdmin(email: string): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  
  // This is a simplified way to add an admin.
  // In a real app, you might want to look up the user by email first
  // to get their UID and add the document with the UID as the ID.
  // For simplicity, we are adding by email and assuming the auth guard
  // will check for the logged-in user's email in this collection.
  // A better approach involves Firebase Functions to manage roles.

  const adminsCollection = collection(db, 'admins');
  const q = query(adminsCollection, where("email", "==", email));
  const existing = await getDocs(q);

  if (!existing.empty) {
      throw new Error("This email already has admin privileges.");
  }
  
  // Note: This approach requires security rules to allow users to read the admins collection
  // to check their own role, but restrict write access to only other admins.
  // This example assumes such rules are in place.
  
  // For this demo, we'll add with a generated ID.
  // The AuthGuard will need to query by email.
  await addDoc(adminsCollection, {
    email: email,
    role: 'admin',
    createdAt: new Date(),
  });
}
