import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './environments/environment';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database (your existing setup)
export const database = getDatabase(app);

// Initialize Firestore (needed for email extension)
export const firestore = getFirestore(app);