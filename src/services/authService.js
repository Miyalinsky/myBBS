import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged as firebaseOnAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from '../firebase/firebaseConfig';

// ユーザーが管理者かどうかを確認する関数
export const checkIfUserIsAdmin = async (userId) => {
    if (!userId) {
        console.error("User ID is undefined or null.");
        return false;
    }

    try {
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (!userDoc.exists()) {
            console.error("User document does not exist.");
            return false;
        }
        return userDoc.data().isAdmin === true;
    } catch (error) {
        console.error("Error checking if user is admin: ", error);
        return false;
    }
};

// 既存の認証関連関数
export const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};

export const onAuthStateChanged = (callback) => {
    return firebaseOnAuthStateChanged(auth, callback);
};
