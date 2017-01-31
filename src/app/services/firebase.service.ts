import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {NewUser} from "../domain/user.interface";
import {Observable} from "rxjs";
import {AuthError, AuthErrorCode} from "./auth.error";

const config = {
    apiKey: "AIzaSyB5RBALHF5YGi_TK0M-hVyuQdkmHWACQH0",
    authDomain: "koffi-bd880.firebaseapp.com",
    databaseURL: "https://koffi-bd880.firebaseio.com",
    storageBucket: "koffi-bd880.appspot.com",
    messagingSenderId: "154364068514"
};

const authErrors = {
    'auth/email-already-in-use': AuthErrorCode.EmailInUse,
    'auth/invalid-email': AuthErrorCode.InvalidEmail,
    'auth/weak-password': AuthErrorCode.InvalidPassword,
    'auth/network-request-failed': AuthErrorCode.NetworkRequestFailure
};

@Injectable()
export class FirebaseService {

    app: firebase.app.App = null;

    connect(): void {

        console.log(config);

        this.app = firebase.initializeApp(config);
    };

    createUser(newUser: NewUser): Observable<NewUser> {
        if (this.app == null) {
            let code = AuthErrorCode.Unknown;
            let msg = 'App not initialized';
            return Observable.throw(new AuthError(code, msg));
        }

        return Observable.create(obs => {
            firebase.auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password)
                .then((firebaseUser: firebase.User) => {
                    //TODO: Update display name and pass back our user
                    obs.next();
                })
                .catch((error: firebase.FirebaseError) => {
                    let code = error.code in authErrors
                        ? authErrors[error.code] : AuthErrorCode.Unknown;
                    let msg = error.message;
                    obs.error(new AuthError(code, msg));
                });
        });
    };


    //public signInWithEmailAndPassword()

    // private updateDisplayName(displayName: string): Observable<void> {
    //
    //
    //
    //     return Observable.fromPromise(firebase.auth().)
    //
    // }

}