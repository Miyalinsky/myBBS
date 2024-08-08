import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged as firebaseOnAuthStateChanged } from 'firebase/auth';

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
