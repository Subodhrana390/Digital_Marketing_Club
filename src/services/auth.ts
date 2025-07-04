'use client';

import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged as _onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  type User
} from 'firebase/auth';
import { app } from '@/lib/firebase';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return _onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
}

export function signOutUser() {
  return signOut(auth);
}
