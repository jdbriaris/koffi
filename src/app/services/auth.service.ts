import {Observable} from "rxjs/Observable";
import {NewUser} from "../domain/user.interface";
import {OpaqueToken} from "@angular/core";

export let AUTH_SERVICE = new OpaqueToken('auth.service');

export interface AuthService {
    logIn(): Observable<boolean>;
    logOut(): void;
    createUser(newUser: NewUser): Observable<NewUser>;
}
