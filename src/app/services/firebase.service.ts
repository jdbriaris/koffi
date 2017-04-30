import {Injectable, Inject} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {
    AuthService, LogInError, LoginCredentials, NewUser, User, CreateUserError,
    ResetPasswordError
} from "./auth.service";
import {FIREBASE_AUTH} from "./firebase.app.provider";
import Auth = firebase.auth.Auth;
import FirebaseUser = firebase.User;
import Error = firebase.auth.Error;
import {Subject} from "rxjs/Subject";

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
    'auth/invalid-email': ResetPasswordError.InavlidEmail,
    'auth/user-not-found': ResetPasswordError.UserNotFound
};

@Injectable()
export class FirebaseService implements AuthService {
    private userLogInStateSubject: Subject<User>;
    private userLoggedIn = false;

    constructor(@Inject(FIREBASE_AUTH) private firebaseApp: Auth) {
        this.userLogInStateSubject = new Subject();

        firebaseApp.onAuthStateChanged(
            (fbUser: FirebaseUser) =>
                this.onFirebaseAuthStateChanged(fbUser, this.userLogInStateSubject),
            (fbError: Error) =>
                this.userLogInStateSubject.error(fbError.message),
            () => {
                this.userLogInStateSubject.complete()
            }
        );
    }

    private onFirebaseAuthStateChanged(fbUser: FirebaseUser, subject: Subject<User>): void {
        if (fbUser) {
            let user = this.makeUserFromFbUser(fbUser);
            this.userLoggedIn = true;
            subject.next(user);
        }
        else {
            this.userLoggedIn = false;
            subject.next(null);
        }
    }

    onUserLogInStateChanged(): Subject<User> {
        return this.userLogInStateSubject;
    }

    logIn(credentials: LoginCredentials): Observable<User> {
        return Observable.create(obs => {
            this.firebaseApp.signInWithEmailAndPassword(credentials.email, credentials.password)
                .then((res: any) => {
                    let user = this.makeUserFromFbUser(res as firebase.User);
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

    createUser(newUser: NewUser): Observable<User> {
        return Observable.create(obs => {
            this.firebaseApp.createUserWithEmailAndPassword(newUser.email, newUser.password)
                .then((res: FirebaseUser) => {
                    let user: User;
                    user = {
                        name: res.displayName,
                        email: res.email,
                        uid: res.uid
                    };
                    this.userLoggedIn = true;
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

    isUserLoggedIn(): boolean {
        return this.userLoggedIn;
    }

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

    private makeUserFromFbUser(fbUser: firebase.User) {
        let user: User;
        user = {
            email: fbUser.email,
            name: fbUser.displayName,
            uid: fbUser.uid
        };
        return user;
    }
}
