// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const env = (key) => String(import.meta.env[key] || "").trim();

const firebaseConfig = {
  apiKey: env("VITE_apiKey"),
  authDomain: env("VITE_authDomain"),
  projectId: env("VITE_projectId"),
  storageBucket: env("VITE_storageBucket"),
  messagingSenderId: env("VITE_messagingSenderId"),
  appId: env("VITE_appId")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);