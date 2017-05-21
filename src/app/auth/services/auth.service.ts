import {Observable} from "rxjs/Observable";
import {OpaqueToken} from "@angular/core";
import {User} from "../auth/user";

export let AUTH_SERVICE = new OpaqueToken('auth.service');

export interface LoginCredentials {
    email: string,
    password: string
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
    InvalidEmail,
    UserNotFound,
    Failed
}

export interface AuthService {
    logIn(credentials: LoginCredentials): Observable<User>;
    logOut(): Observable<void>;
    createNewUser(newUser: NewUser): Observable<User>;
    resetPassword(email: string): Observable<void>;
    onUserLogInStateChanged(): Observable<User>;
}
