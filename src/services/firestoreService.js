import { collection, doc, getDoc, getDocs, query, orderBy, serverTimestamp, setDoc } from 'firebase/firestore';
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

export const addPost = async (threadId, content, userId, handleName = '名無し', userIdByIp) => {
    try {
        const postRef = doc(collection(firestore, `threads/${threadId}/posts`));
        await setDoc(postRef, {
            content: content,
            createdAt: serverTimestamp(),
            createdBy: userId,
            handleName: handleName,
            userIdByIp: userIdByIp
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
        const q = query(collection(firestore, `threads/${threadId}/posts`), orderBy('createdAt', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting posts: ', error);
        throw error;
    }
};

export const getThreadTitle = async (threadId) => {
    try {
        const threadDoc = await getDoc(doc(firestore, 'threads', threadId));
        if (threadDoc.exists()) {
            return threadDoc.data().title;
        } else {
            throw new Error('Thread not found');
        }
    } catch (error) {
        console.error('Error getting thread title: ', error);
        throw error;
    }
};
