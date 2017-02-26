import {Observable} from "rxjs/Observable";
import {OpaqueToken} from "@angular/core";

export let AUTH_SERVICE = new OpaqueToken('auth.service');

export enum LogInResult {
    'Success',
    'Failed'
}

export interface AuthService {
    logIn(): Observable<LogInResult>;
    logOut(): void;
    //createUser(newUser: NewUser): Observable<NewUser>;
}
