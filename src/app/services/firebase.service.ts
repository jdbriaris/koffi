import {Injectable, Inject} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {AuthService, LogInResult, LoginCredentials, NewUser, User, CreateUserError} from "./auth.service";
import {FIREBASE_AUTH} from "./firebase.app.provider";
import Auth = firebase.auth.Auth;
import FirebaseUser = firebase.User;

const firebaseSignInErrors = {
    'auth/user-not-found': LogInResult.UserNotFound,
    'auth/invalid-email': LogInResult.UserNotFound,
    'auth/wrong-password': LogInResult.WrongPassword,
};

const firebaseCreateUserErrors = {
    'auth/email-already-in-use': CreateUserError.EmailAlreadyRegistered,
    'auth/invalid-email': CreateUserError.InvalidEmail,
    'auth/weak-password': CreateUserError.WeakPassword,
};

@Injectable()
export class FirebaseService implements AuthService {
    private userLoggedIn = false;

    constructor(@Inject(FIREBASE_AUTH) private firebaseApp: Auth) {}

    logIn(credentials: LoginCredentials): Observable<LogInResult> {
        return Observable.create(obs => {
            this.firebaseApp.signInWithEmailAndPassword(credentials.email, credentials.password)
                .then(() => {
                    this.userLoggedIn = true;
                    obs.next(LogInResult.Success);
                })
                .catch((err: any) => {
                    if (err in firebaseSignInErrors) {
                        obs.error(firebaseSignInErrors[err]);
                    }
                    obs.error(LogInResult.Failed);
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
                    if (err in firebaseCreateUserErrors) {
                        obs.error(firebaseCreateUserErrors[err]);
                    }
                    obs.error(CreateUserError.Failed);
            });
        });
    };

    isUserLoggedIn(): boolean {
        return this.userLoggedIn;
    }
}
