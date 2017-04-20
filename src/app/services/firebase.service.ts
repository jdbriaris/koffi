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

    private userLoggedIn = false;

    constructor(@Inject(FIREBASE_AUTH) private firebaseApp: Auth) {}

    logIn(credentials: LoginCredentials): Observable<User> {
        return Observable.create(obs => {
            this.firebaseApp.signInWithEmailAndPassword(credentials.email, credentials.password)
                .then((res: any) => {
                    let user = this.makeUserFromFbUser(res as firebase.User);
                    this.userLoggedIn = true;
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

    logOut(): void {
        this.firebaseApp.signOut().then(() => {
            this.userLoggedIn = false;
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
