import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBzPXvrNi5vDO1xy9CQ1KQ-8yO1qAOdQro",
    authDomain: "figgerits-1f3e3.firebaseapp.com",
    projectId: "figgerits-1f3e3",
    storageBucket: "figgerits-1f3e3.appspot.com",
    messagingSenderId: "1091049680698",
    appId: "1:1091049680698:web:4d432351f554c9ef036a03",
    measurementId: "G-VYW1CFN9KR"
  };

  // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);

initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export { auth, provider };