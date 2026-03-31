import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// 1. Firebase configuration from Environment Variables
// It gracefully degrades if keys are missing
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = !!firebaseConfig.apiKey;

let db = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

// Generates an anonymous device ID for syncing if no auth
const getDeviceId = () => {
  let id = localStorage.getItem('device_sync_id');
  if (!id) {
    id = 'device_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('device_sync_id', id);
  }
  return id;
};

export const syncStateToCloud = async (stateData) => {
  if (!db) return false;
  
  try {
    const deviceId = getDeviceId();
    const docRef = doc(db, 'userProfiles', deviceId);
    
    // We merge the new state with the existing cloud state
    await setDoc(docRef, {
      ...stateData,
      lastUpdated: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Cloud Sync Error:", error);
    return false;
  }
};

export const loadStateFromCloud = async () => {
  if (!db) return null;
  
  try {
    const deviceId = getDeviceId();
    const docRef = doc(db, 'userProfiles', deviceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Cloud Load Error:", error);
    return null;
  }
};

export const getCloudStatus = () => isFirebaseConfigured;
