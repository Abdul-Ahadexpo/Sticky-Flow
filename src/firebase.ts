import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDPhrD1kuVokps9tSan6l0aM-5mMDnvjMA",
  authDomain: "daily-flow-66938.firebaseapp.com",
  databaseURL: "https://daily-flow-66938-default-rtdb.firebaseio.com",
  projectId: "daily-flow-66938",
  storageBucket: "daily-flow-66938.firebasestorage.app",
  messagingSenderId: "473080345785",
  appId: "1:473080345785:web:3cf5f5edbb98af753c9768",
  measurementId: "G-ZCY7CHR1ST"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
