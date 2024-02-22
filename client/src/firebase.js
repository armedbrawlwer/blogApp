// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApgAkugFhbPZR6IrfZolr5pFVUkx7fU9Y",
  authDomain: "mern-blog-dcdb3.firebaseapp.com",
  projectId: "mern-blog-dcdb3",
  storageBucket: "mern-blog-dcdb3.appspot.com",
  messagingSenderId: "926393445313",
  appId: "1:926393445313:web:2881ab9b785feba50cdd40",
  measurementId: "G-FMKCSEEH2L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);