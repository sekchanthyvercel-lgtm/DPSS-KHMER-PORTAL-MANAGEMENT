import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc, collection } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { AppData } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);                
export const auth = getAuth();

// Sign in anonymously for easy access to the app
signInAnonymously(auth).catch(console.error);

const DATA_DOC_ID = 'app_data';

export const subscribeToData = (onData: (data: AppData) => void, onError: (err: any) => void) => {
  const docRef = doc(db, 'app_data_collection', DATA_DOC_ID);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      onData(snapshot.data() as AppData);
    } else {
      // Initialize if missing
      const initialData: AppData = { students: [], settings: { fontSize: 12, fontFamily: "'Inter', sans-serif" }, attendance: {} };
      setDoc(docRef, initialData).catch(onError);
    }
  }, onError);
};

export const saveData = async (data: AppData) => {
  const docRef = doc(db, 'app_data_collection', DATA_DOC_ID);
  await setDoc(docRef, data);
};
