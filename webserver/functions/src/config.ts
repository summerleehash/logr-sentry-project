import firebaseAdmin from "firebase-admin";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";

export const admin = firebaseAdmin.initializeApp();

const getFirebaseConfig = async () => {
  const snap = await admin.firestore().collection("configuration").doc("firebase-config").get()
  return snap.data() as {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  }
}

let app: FirebaseApp | null = null

export const getFirebaseClientApp = async () => {
  if (!app) {
    app = initializeApp(await getFirebaseConfig())
  }
  
  return app
}