import { collection, getDocs, orderBy, query, doc, getDoc, addDoc, updateDoc, deleteDoc, where, Timestamp, type DocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost } from '@/lib/types';

function calculateReadTime(content: string): number {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

function docToBlogPost(doc: DocumentSnapshot<DocumentData>): BlogPost | null {
    const data = doc.data();
    // Validate required fields
    if (
        !data || 
        !(data.date instanceof Timestamp) ||
        typeof data.title !== 'string' ||
        typeof data.slug !== 'string' ||
        typeof data.author !== 'string' ||
        typeof data.category !== 'string' ||
        typeof data.content !== 'string' ||
        typeof data.excerpt !== 'string' ||
        typeof data.imageUrl !== 'string'
    ) {
        console.error("Invalid or incomplete blog post data for doc ID:", doc.id);
        return null;
    }

    return {
        id: doc.id,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        date: data.date.toDate().toISOString(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : undefined,
        category: data.category,
        imageUrl: data.imageUrl,
        imageHint: data.imageHint, // Optional field
        slug: data.slug,
        readTime: typeof data.readTime === 'number' ? data.readTime : calculateReadTime(data.content),
    };
}


export async function getBlogPosts(): Promise<BlogPost[]> {
    if (!db) return [];
    const postsCollection = collection(db, 'blogPosts');
    const q = query(postsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToBlogPost).filter((post): post is BlogPost => post !== null);
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
    if (!db) return null;
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return docToBlogPost(docSnap);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!db) return null;
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const docSnap = querySnapshot.docs[0];
    return docToBlogPost(docSnap);
}

export async function addBlogPost(post: Omit<BlogPost, 'id' | 'date' | 'updatedAt'>) {
    if (!db) throw new Error("Firebase not initialized");
    const now = Timestamp.fromDate(new Date());
    const newPost = {
        ...post,
        date: now,
        updatedAt: now,
    };
    const docRef = await addDoc(collection(db, 'blogPosts'), newPost);
    return docRef.id;
}

export async function updateBlogPost(id: string, post: Partial<Omit<BlogPost, 'id'>>) {
    if (!db) throw new Error("Firebase not initialized");
    const updateData = {
        ...post,
        updatedAt: Timestamp.fromDate(new Date()),
    };
    await updateDoc(doc(db, 'blogPosts', id), updateData);
}

export async function deleteBlogPost(id: string) {
    if (!db) throw new Error("Firebase not initialized");
    await deleteDoc(doc(db, 'blogPosts', id));
}
