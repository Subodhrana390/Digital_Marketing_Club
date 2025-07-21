'use client';

import { 
  getAuth, 
  onAuthStateChanged as _onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  type User
} from 'firebase/auth';
import { app } from '@/lib/firebase';

const auth = app ? getAuth(app) : null;

export function onAuthStateChanged(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return _onAuthStateChanged(auth, callback);
}

export async function signInWithEmail(email: string, password: string) {
    if (!auth) throw new Error("Firebase not initialized");
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
}

export function signOutUser() {
  if (!auth) throw new Error("Firebase not initialized");
  return signOut(auth);
}
