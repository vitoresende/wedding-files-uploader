import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

if (!process.env.REACT_APP_FIREBASE_CONFIG) {
    throw new Error('REACT_APP_FIREBASE_CONFIG is not defined');
}

const firebaseApp = firebase.initializeApp(JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG));

const db = firebaseApp.firestore();
export default db;