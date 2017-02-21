import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {FirebaseService} from "./firebase.service";
import {NewUser} from "../domain/user.interface";
import {AuthService} from "./auth.service";

@Injectable()
export class FirebaseAuthService implements AuthService {

    isLoggedIn: boolean = false;

    constructor(private firebaseService: FirebaseService) {}

    logIn(): Observable<boolean> {
        return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
    };

    logOut(): void {
        this.isLoggedIn = false;
    };

    createUser(newUser: NewUser): Observable<NewUser> {
        return this.firebaseService.createUser(newUser);
    };
}
