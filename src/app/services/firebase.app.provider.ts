import * as firebase from 'firebase';
import {OpaqueToken} from "@angular/core";

export let FIREBASE_AUTH = new OpaqueToken('firebase.auth');

export let firebaseAppFactory = () => {
    return firebase.app().auth();
};