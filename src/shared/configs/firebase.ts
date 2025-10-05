// // app/firebase.ts
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// // Thay bằng config của bạn từ Firebase Console
// const firebaseConfig = {
//   apiKey: "AIzaSyAXTsz6NaJuq1HkOrQ5--Ijcaph7Pf9acE",
//   authDomain: "kltn-c8649.firebaseapp.com",
//   projectId: "kltn-c8649",
//   storageBucket: "kltn-c8649.firebasestorage.app",
//   messagingSenderId: "909356212752",
//   appId: "1:909356212752:web:d5c07e8186524055aae095",
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
