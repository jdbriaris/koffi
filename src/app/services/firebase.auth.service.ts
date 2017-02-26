import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {FirebaseService} from "./firebase.service";
import {NewUser} from "../domain/user.interface";
import {AuthService, LogInResult, CreateUserResult} from "./auth.service";

@Injectable()
export class FirebaseAuthService implements AuthService {
    isLoggedIn: boolean = false;

    constructor(private firebaseService: FirebaseService) {}

    logIn(): Observable<LogInResult> {
        return Observable.of(LogInResult.Failed).delay(1000).do(val => this.isLoggedIn = true);
    };

    logOut(): void {
        this.isLoggedIn = false;
    };

    createUser(newUser: NewUser): Observable<CreateUserResult> {
        return Observable.of(CreateUserResult.InvalidEmail);
    };
}
