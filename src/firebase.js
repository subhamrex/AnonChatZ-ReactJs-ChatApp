import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyDHEl_NU28msHk_VAgOzX9u3kHP73m8Fno",
    authDomain: "anonchatz-eb198.firebaseapp.com",
    projectId: "anonchatz-eb198",
    storageBucket: "anonchatz-eb198.appspot.com",
    messagingSenderId: "136394996980",
    appId: "1:136394996980:web:8d6ed191be2ba59b45b2a1",
    measurementId: "G-7CYR2WZ6M3"
  
})

const db = firebaseApp.firestore()

export default db