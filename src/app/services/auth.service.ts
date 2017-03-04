import {Observable} from "rxjs/Observable";
import {OpaqueToken} from "@angular/core";
import {NewUser} from "../domain/user.interface";

export let AUTH_SERVICE = new OpaqueToken('auth.service');

export interface LoginCredentials {
    email: string,
    password: string
}

export enum LogInResult {
    'Success',
    'UserNotFound',
    'WrongPassword',
    'Failed'
}

export enum CreateUserResult {
    'Success',
    'Failed',
    'EmailAlreadyRegistered',
    'InvalidEmail',
    'InvalidPassword'
}

export interface AuthService {
    logIn(credentials: LoginCredentials): Observable<LogInResult>;
    logOut(): void;
    createUser(newUser: NewUser): Observable<CreateUserResult>;
    isUserLoggedIn() : boolean;
}
