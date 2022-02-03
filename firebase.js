import * as firebase from 'firebase'
import 'firebase/auth';
import 'firebase/firestore';
import { AppState } from 'react-native';

const firebaseConfig = {
    apiKey: "AIzaSyCtfTa3vx1fhFW8RZtTMYJQmZkdATgujSs",
    authDomain: "task-fd2d0.firebaseapp.com",
    projectId: "task-fd2d0",
    storageBucket: "task-fd2d0.appspot.com",
    messagingSenderId: "983035469346",
    appId: "1:983035469346:web:7b7ed1e8d69b249eb8f47b"
  };
  

app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = firebase.auth();
export {db, auth};