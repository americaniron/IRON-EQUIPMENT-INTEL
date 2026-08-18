import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App | null = null;

export function getAdminApp(): App {
  if (!app) {
    if (getApps().length === 0) {
      try {
        app = initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'acquire-intel-app',
        });
      } catch (err) {
        console.warn('Firebase Admin init warning:', err);
        app = getApps()[0] || initializeApp();
      }
    } else {
      app = getApp();
    }
  }
  return app;
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

// Proxies for backwards compatibility with existing imports
export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    const adminDb = getAdminDb();
    const val = (adminDb as any)[prop];
    return typeof val === 'function' ? val.bind(adminDb) : val;
  }
});

export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const adminAuth = getAdminAuth();
    const val = (adminAuth as any)[prop];
    return typeof val === 'function' ? val.bind(adminAuth) : val;
  }
});

