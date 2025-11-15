// src/config/firebaseConfig.ts
import firebase from '@react-native-firebase/app';

// Konfigurasi Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyBVnV8o1s-tXJY-aBfR_9ym_mDpiF5Nyf0",
  authDomain: "yume-app-7fa51.firebaseapp.com",
  databaseURL: "https://yume-app-7fa51-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "yume-app-7fa51",
  storageBucket: "yume-app-7fa51.appspot.com",
  messagingSenderId: "371483061040",
  appId: "1:371483061040:web:777b9da78512115eb0b6f5",
  measurementId: "G-W4V6KBYG62",
};

// Cegah inisialisasi ganda
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
