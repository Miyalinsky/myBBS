import { collection, doc, getDocs, query, orderBy, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';

export const addThread = async (title, userId) => {
    try {
        const threadRef = doc(collection(firestore, 'threads'));
        await setDoc(threadRef, {
            title: title,
            createdAt: serverTimestamp(),
            createdBy: userId
        });
        return threadRef.id;
    } catch (error) {
        console.error('Error adding thread: ', error);
        throw error;
    }
};

export const addPost = async (threadId, content, userId, handleName = '名無し') => {
    try {
        const postRef = doc(collection(firestore, `threads/${threadId}/posts`));
        await setDoc(postRef, {
            content: content,
            createdAt: serverTimestamp(),
            createdBy: userId,
            handleName: handleName
        });
        return postRef.id;
    } catch (error) {
        console.error('Error adding post: ', error);
        throw error;
    }
};

export const getThreads = async () => {
    try {
        const q = query(collection(firestore, 'threads'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting threads: ', error);
        throw error;
    }
};

export const getPosts = async (threadId) => {
    try {
        const q = query(collection(firestore, `threads/${threadId}/posts`), orderBy('createdAt', 'asc')); // 昇順で取得
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting posts: ', error);
        throw error;
    }
};
