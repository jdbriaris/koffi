import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {NewUser} from "../domain/user.interface";
import {AuthService, LogInResult, CreateUserResult} from "./auth.service";

const config = {
    apiKey: "AIzaSyB5RBALHF5YGi_TK0M-hVyuQdkmHWACQH0",
    authDomain: "koffi-bd880.firebaseapp.com",
    databaseURL: "https://koffi-bd880.firebaseio.com",
    storageBucket: "koffi-bd880.appspot.com",
    messagingSenderId: "154364068514"
};

@Injectable()
export class FirebaseService implements AuthService {
    private app: firebase.app.App = null;
    isLoggedIn: boolean = false;

    constructor() {
        this.app = firebase.initializeApp(config);
    }

    logIn(): Observable<LogInResult> {
        return Observable.of(LogInResult.Failed).delay(1000).do(val => this.isLoggedIn = true);
    };

    logOut(): void {
        this.isLoggedIn = false;
    };

    createUser(newUser: NewUser): Observable<CreateUserResult> {
        return Observable.of(CreateUserResult.EmailAlreadyRegistered);
    };
}
