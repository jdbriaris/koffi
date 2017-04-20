import {Observable} from "rxjs/Observable";
import {OpaqueToken} from "@angular/core";

export let AUTH_SERVICE = new OpaqueToken('auth.service');

export interface LoginCredentials {
    email: string,
    password: string
}

export interface User {
    name: string;
    email: string;
    uid: string;
}

export interface NewUser {
    name: string;
    email: string;
    password: string;
}

export enum LogInError {
    'UserNotFound',
    'WrongPassword',
    'Failed'
}

export enum CreateUserError {
    'Failed',
    'EmailAlreadyRegistered',
    'InvalidEmail',
    'WeakPassword'
}

export enum ResetPasswordError {
    'InavlidEmail',
    'UserNotFound',
    'Failed'
}

export interface AuthService {
    logIn(credentials: LoginCredentials): Observable<User>;
    logOut(): void;
    createUser(newUser: NewUser): Observable<User>;
    isUserLoggedIn() : boolean;
    resetPassword(email: string): Observable<void>;
}
