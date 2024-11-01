import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDhXwPajIp3S89P_G_mPagtfQfeS6ImzLE",
    authDomain: "react-drive-bb0bc.firebaseapp.com",
    projectId: "react-drive-bb0bc",
    storageBucket: "react-drive-bb0bc.appspot.com",
    messagingSenderId: "979996437",
    appId: "1:979996437:web:7d4094db66b4e00fa8231c",
    measurementId: "G-WKWQMV6L2P"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
