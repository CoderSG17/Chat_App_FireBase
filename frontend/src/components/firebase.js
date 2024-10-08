import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import firebaseConfig from "../config/firebaseConfig";
import {getStorage} from "firebase/storage"

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp); // For Authentication
const db = getFirestore(firebaseApp); // For Using Database
const storage = getStorage(); // For Using Storage
const firestore = getFirestore(firebaseApp);

export { auth, db ,storage,firestore};