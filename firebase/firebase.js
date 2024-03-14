// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyA_bO6SIIBvVYqB_F54hWtj3LR6l7lrKxw",

  authDomain: "mapdemo-28c1b.firebaseapp.com",

  projectId: "mapdemo-28c1b",

  storageBucket: "mapdemo-28c1b.appspot.com",

  messagingSenderId: "493261652775",

  appId: "1:493261652775:web:bd6d05bb52f4768b389f02",

  measurementId: "G-5SZ7JZ9V73"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const database = getFirestore(app)

const storage = getStorage(app)

export {app, database, storage} 