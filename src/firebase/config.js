import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCYJVS-Rc3KgnVxnu9-HTxQY6RwaBCBnh8",
  authDomain: "jinshiro-daiko.firebaseapp.com",
  projectId: "jinshiro-daiko",
  storageBucket: "jinshiro-daiko.firebasestorage.app",
  messagingSenderId: "632728803219",
  appId: "1:632728803219:web:ff90087e5e65cb12a27a66",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
