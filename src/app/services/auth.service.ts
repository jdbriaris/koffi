import {Observable} from "rxjs/Observable";
import {OpaqueToken} from "@angular/core";
import {NewUser} from "../domain/user.interface";

export let AUTH_SERVICE = new OpaqueToken('auth.service');

export enum LogInResult {
    'Success',
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
    logIn(): Observable<LogInResult>;
    logOut(): void;
    createUser(newUser: NewUser): Observable<CreateUserResult>;
}
