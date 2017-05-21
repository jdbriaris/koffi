import {Injectable, Inject, NgZone} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {
    AuthService, LogInError, LoginCredentials, NewUser, CreateUserError,
    ResetPasswordError
} from "./auth.service";
import {FIREBASE_AUTH} from "./firebase.app.provider";
import Auth = firebase.auth.Auth;
import FirebaseUser = firebase.User;
import Error = firebase.auth.Error;
import {Observer} from "rxjs/Observer";
import {observeOn} from "rxjs/operator/observeOn";
import {ZoneScheduler} from "../utils/utils";
import {User} from "../auth/user";

const firebaseSignInErrors = {
    'auth/user-not-found': LogInError.UserNotFound,
    'auth/invalid-email': LogInError.UserNotFound,
    'auth/wrong-password': LogInError.WrongPassword,
};

const firebaseCreateUserErrors = {
    'auth/email-already-in-use': CreateUserError.EmailAlreadyRegistered,
    'auth/invalid-email': CreateUserError.InvalidEmail,
    'auth/weak-password': CreateUserError.WeakPassword,
};

const firebaseSendResetPasswordEmailErrors = {
    'auth/invalid-email': ResetPasswordError.InvalidEmail,
    'auth/user-not-found': ResetPasswordError.UserNotFound
};

@Injectable()
export class FirebaseService implements AuthService {

    constructor(
        @Inject(FIREBASE_AUTH) private firebaseApp: Auth,
        private zone: NgZone
    ) {}

    onUserLogInStateChanged(): Observable<User> {
        const logInState = Observable.create((observer: Observer<User>) => {
            this.firebaseApp.onAuthStateChanged(
                (user?: firebase.User) => {
                    if (user) {
                        observer.next(FirebaseService.createUser(user));
                    } else {
                        observer.next(null);
                    }
                },
                (error: firebase.auth.Error) => observer.error(error),
                () => observer.complete()
            )
        });
        return observeOn.call(logInState, new ZoneScheduler(this.zone));
    };

    logIn(credentials: LoginCredentials): Observable<User> {
        return Observable.create(obs => {
            this.firebaseApp.signInWithEmailAndPassword(credentials.email, credentials.password)
                .then((res: any) => {
                    let user = FirebaseService.createUser(res as firebase.User);
                    obs.next(user);
                })
                .catch((err: any) => {
                    let fbError = err as firebase.auth.Error;
                    if (fbError.code in firebaseSignInErrors) {
                        obs.error(firebaseSignInErrors[fbError.code]);
                    }
                    obs.error(LogInError.Failed);
                });
        });
    };

    logOut(): Observable<void> {
        return Observable.create(obs => {
            this.firebaseApp.signOut().then(() => {
                obs.next();
            });
        });
    };

    createNewUser(newUser: NewUser): Observable<User> {
        return Observable.create(obs => {
            this.firebaseApp.createUserWithEmailAndPassword(newUser.email, newUser.password)
                .then((res: FirebaseUser) => {
                    let user = FirebaseService.createUser(res);
                    obs.next(user);
                })
                .catch((err: any) => {
                    let fbError = err as firebase.auth.Error;
                    if (fbError.code in firebaseCreateUserErrors) {
                        obs.error(firebaseCreateUserErrors[fbError.code]);
                    }
                    obs.error(CreateUserError.Failed);
            });
        });
    };

    resetPassword(email: string): Observable<void> {
        return Observable.create(obs => {
            this.firebaseApp.sendPasswordResetEmail(email)
                .then(() => {
                    obs.next();
                    })
                .catch((err: any) => {
                    let fbError = err as firebase.auth.Error;
                    if (fbError.code in firebaseSendResetPasswordEmailErrors) {
                        obs.error(firebaseSendResetPasswordEmailErrors[fbError.code]);
                    }
                    obs.error(ResetPasswordError.Failed);
                });
        });
    };

    private static createUser(fbUser: firebase.User) : User {
        let user: User;
        user = {
            email: fbUser.email,
            name: fbUser.displayName,
            uid: fbUser.uid
        };
        return user;
    };
}
