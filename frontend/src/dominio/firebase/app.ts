import {getApp, getApps, initializeApp} from "firebase/app";
import type {FirebaseOptions} from "firebase/app";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";

type FirebaseConfigKeys =
    | "VITE_FIREBASE_API_KEY"
    | "VITE_FIREBASE_AUTH_DOMAIN"
    | "VITE_FIREBASE_DATABASE_URL"
    | "VITE_FIREBASE_PROJECT_ID"
    | "VITE_FIREBASE_STORAGE_BUCKET"
    | "VITE_FIREBASE_MESSAGING_SENDER_ID"
    | "VITE_FIREBASE_APP_ID";

const resolveEnv = (key: FirebaseConfigKeys): string => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Firebase configuração ausente: defina ${key} no seu arquivo .env`);
    }
    return value;
};

const normalizarBucket = (rawBucket: string): string => {
    let bucket = rawBucket.trim();
    if (bucket.startsWith("gs://")) {
        bucket = bucket.slice(5);
    }
    if (bucket.endsWith("/")) {
        bucket = bucket.slice(0, -1);
    }
    if (bucket.includes("firebasestorage.app")) {
        bucket = bucket.replace("firebasestorage.app", "appspot.com");
    }
    return bucket;
};

const firebaseConfig: FirebaseOptions = {
    apiKey: resolveEnv("VITE_FIREBASE_API_KEY"),
    authDomain: resolveEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    databaseURL: resolveEnv("VITE_FIREBASE_DATABASE_URL"),
    projectId: resolveEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: normalizarBucket(resolveEnv("VITE_FIREBASE_STORAGE_BUCKET")),
    messagingSenderId: resolveEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: resolveEnv("VITE_FIREBASE_APP_ID"),
};

const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

if (measurementId) {
    firebaseConfig.measurementId = measurementId;
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
