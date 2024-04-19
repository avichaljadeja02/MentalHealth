import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBw9d_bpihNj9EAjZND1PHQMHmWh0SXSYs",
    authDomain: "mentalhealthapp-26b6a.firebaseapp.com",
    projectId: "mentalhealthapp-26b6a",
    storageBucket: "mentalhealthapp-26b6a.appspot.com",
    messagingSenderId: "737785453189",
    appId: "1:737785453189:web:2b8b83a1c25352281c67ec",
    measurementId: "G-88J8GMYXCN"
  };

  export const FIREBASE_APP = initializeApp(firebaseConfig)
  export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
  export const FIREBASE_DB = getFirestore(FIREBASE_APP)