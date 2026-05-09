import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

export function getFirebase(): { app: FirebaseApp; db: Firestore; auth: Auth } | null {
  const key = import.meta.env.VITE_FIREBASE_API_KEY?.trim()
  const pid = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim()
  if (!key || !pid) return null

  if (!app) {
    app = initializeApp({
      apiKey: key,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: pid,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    })
    db = getFirestore(app)
    auth = getAuth(app)
  }
  return app && db && auth ? { app, db, auth } : null
}

/** Анонимная авторизация: избранное в Firestore привязано к uid. Включите Anonymous в Firebase Console → Authentication. */
export async function ensureAnonymousUser(): Promise<string | null> {
  const fb = getFirebase()
  if (!fb) return null
  if (fb.auth.currentUser) return fb.auth.currentUser.uid
  const cred = await signInAnonymously(fb.auth)
  return cred.user.uid
}
