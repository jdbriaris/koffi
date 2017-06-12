import {Observable} from "rxjs/Observable";
import {InjectionToken} from "@angular/core";
import {User} from "../user";

export let AUTH_SERVICE = new InjectionToken<AuthService>('auth.service');

export interface Credentials {
    email: string,
    password: string
}

export interface NewUserCredentials extends Credentials {
    name: string;
}

export interface AuthService {
    logIn(credentials: Credentials): Observable<User>;
    logOut(): Observable<void>;
    createNewUser(newUser: NewUserCredentials): Observable<User>;
    resetPassword(email: string): Observable<void>;
    onUserLogInStateChanged(): Observable<User>;
}
