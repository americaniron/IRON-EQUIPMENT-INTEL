// Client side firebase initialization
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import config from '../firebase-applet-config.json';

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  app = !getApps().length ? initializeApp(config) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase client initialization warning:', e);
  // Fallback if needed
  app = (!getApps().length ? initializeApp({
    apiKey: "AIzaSyDummyKeyForInitialDevSetup12345678",
    authDomain: "acquire-intel-app.firebaseapp.com",
    projectId: "acquire-intel-app"
  }) : getApp()) as FirebaseApp;
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };
