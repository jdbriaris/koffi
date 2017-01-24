import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {NewUser} from "../domain/user.interface";
import {Observable} from "rxjs";
import {AuthError, AuthErrorCode} from "./auth.error";

const config = {
    apiKey: "AIzaSyDs57dq6uprHErKIzoUdEQXNNPy0JZyvDg",
    authDomain: "xfit-1274d.firebaseapp.com",
    databaseURL: "https://xfit-1274d.firebaseio.com",
    storageBucket: "xfit-1274d.appspot.com",
    messagingSenderId: "854855017201"
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

    // private updateDisplayName(displayName: string): Observable<void> {
    //
    //
    //
    //     return Observable.fromPromise(firebase.auth().)
    //
    // }

}