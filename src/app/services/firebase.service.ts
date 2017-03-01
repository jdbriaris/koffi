import {Injectable, Inject} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {NewUser} from "../domain/user.interface";
import {AuthService, LogInResult, CreateUserResult} from "./auth.service";
import {FIREBASE_AUTH} from "./firebase.app.provider";
import Auth = firebase.auth.Auth;

@Injectable()
export class FirebaseService implements AuthService {
    isLoggedIn: boolean = false;

    constructor(@Inject(FIREBASE_AUTH) private firebaseApp: Auth) {}

    logIn(): Observable<LogInResult> {
        this.firebaseApp.signInWithEmailAndPassword("","");

        return Observable.of(LogInResult.Failed).delay(1000).do(val => this.isLoggedIn = true);
    };

    logOut(): void {
        this.isLoggedIn = false;
    };

    createUser(newUser: NewUser): Observable<CreateUserResult> {
        return Observable.of(CreateUserResult.EmailAlreadyRegistered);
    };
}
