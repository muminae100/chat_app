import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig ={
    apiKey: "AIzaSyALOPka1Ir8C2_LLdrzVAgZAuvfFwyIDD4",
    authDomain: "chat-app-cece3.firebaseapp.com",
    projectId: "chat-app-cece3",
    storageBucket: "chat-app-cece3.appspot.com",
    messagingSenderId: "244152839037",
    appId: "1:244152839037:web:06b102b126cd915b4bfa14"
};

const app = firebase.initializeApp(firebaseConfig); 
const auth = app.auth();

export { auth };