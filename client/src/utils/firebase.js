import {initializeApp} from "firebase/app"
import {getAuth,GoogleAuthProvider} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyChMRtyqKyMZLNYpwOXcfQWAnUxRO5U5Z8",
  authDomain: "ecommerce-3cec9.firebaseapp.com",
  projectId: "ecommerce-3cec9",
  storageBucket: "ecommerce-3cec9.firebasestorage.app",
  messagingSenderId: "649151587001",
  appId: "1:649151587001:web:59e120431f8598ddeab168",
  measurementId: "G-QHPSBBBF6F"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider};

