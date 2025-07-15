// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB9ObV31Msz37pRC3VF8wY1ag2TMnZxdMw",
  authDomain: "fitnesstrackerapp-29447.firebaseapp.com",
  projectId: "fitnesstrackerapp-29447",
  storageBucket: "fitnesstrackerapp-29447.appspot.com",
  messagingSenderId: "87157008031",
  appId: "1:87157008031:web:f30c39177915eff335e4aa",
  measurementId: "G-T6DPKTPH4X"
};

const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { auth };
export const db = getFirestore(app);