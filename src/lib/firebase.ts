// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAKm6h9GyS_hxJv2VnSnPIJfDpQOA81QXg',
  authDomain: 'project-hio.firebaseapp.com',
  projectId: 'project-hio',
  storageBucket: 'project-hio.firebasestorage.app',
  messagingSenderId: '730748666910',
  appId: '1:730748666910:web:10bf4ea79deea895c09a0f',
  measurementId: 'G-325XBVWB1X',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
