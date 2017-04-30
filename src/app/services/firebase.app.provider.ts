import * as firebase from 'firebase';
import {OpaqueToken} from "@angular/core";

const config = {
    apiKey: "AIzaSyB5RBALHF5YGi_TK0M-hVyuQdkmHWACQH0",
    authDomain: "koffi-bd880.firebaseapp.com",
    databaseURL: "https://koffi-bd880.firebaseio.com",
    storageBucket: "koffi-bd880.appspot.com",
    messagingSenderId: "154364068514"
};

export let FIREBASE_AUTH = new OpaqueToken('firebase.auth');

export let firebaseAppFactory = () => {
    firebase.initializeApp(config);
    return firebase.app().auth();
};