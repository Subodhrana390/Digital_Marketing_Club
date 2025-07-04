import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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
            author: data.author,
            // Firestore timestamps need to be converted to JSON-serializable format
            date: data.date.toDate().toISOString(),
            category: data.category,
            imageUrl: data.imageUrl,
            imageHint: data.imageHint,
            slug: data.slug,
        } as BlogPost
    });
}
