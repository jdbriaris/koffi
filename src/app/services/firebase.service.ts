import {Injectable, Inject} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {NewUser} from "../domain/user.interface";
import {AuthService, LogInResult, CreateUserResult, LoginCredentials} from "./auth.service";
import {FIREBASE_AUTH} from "./firebase.app.provider";
import Auth = firebase.auth.Auth;
import User = firebase.User;

const firebaseAuthErrors = {
    'auth/user-not-found': LogInResult.UserNotFound,
    'auth/invalid-email': LogInResult.UserNotFound,
    'auth/wrong-password': LogInResult.WrongPassword,
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
                    if (err in firebaseAuthErrors) {
                        obs.error(firebaseAuthErrors[err]);
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

    createUser(newUser: NewUser): Observable<CreateUserResult> {
        return Observable.of(CreateUserResult.EmailAlreadyRegistered);
    };

    isUserLoggedIn(): boolean {
        return this.userLoggedIn;
    }
}
