import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost } from '@/lib/types';

export async function getBlogPosts(): Promise<BlogPost[]> {
    const postsCollection = collection(db, 'blogPosts');
    const q = query(postsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            author: data.author,
            date: data.date.toDate().toISOString(),
            category: data.category,
            imageUrl: data.imageUrl,
            imageHint: data.imageHint,
            slug: data.slug,
        } as BlogPost
    });
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        date: data.date.toDate().toISOString(),
    } as BlogPost;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        date: data.date.toDate().toISOString(),
    } as BlogPost;
}

export async function addBlogPost(post: Omit<BlogPost, 'id' | 'date'>) {
    const newPost = {
        ...post,
        date: Timestamp.fromDate(new Date()),
    };
    const docRef = await addDoc(collection(db, 'blogPosts'), newPost);
    return docRef.id;
}

export async function updateBlogPost(id: string, post: Partial<Omit<BlogPost, 'id'>>) {
    await updateDoc(doc(db, 'blogPosts', id), post);
}

export async function deleteBlogPost(id: string) {
    await deleteDoc(doc(db, 'blogPosts', id));
}
