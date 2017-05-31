import {AuthService, Credentials} from "../services/auth.service";
import {Observable} from "rxjs/Observable";
import {User} from "../user";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Injectable} from "@angular/core";
import {AuthError} from "../errors/auth.error";

@Injectable()
export class MockAuthService implements AuthService {
    private userLogInStateChangedBehavior: BehaviorSubject<User>;
    private logInBehavior: BehaviorSubject<User>;
    private createNewUserBehavior: BehaviorSubject<User>;
    private resetPasswordBehavior: BehaviorSubject<void>;

    constructor() {
        this.userLogInStateChangedBehavior = new BehaviorSubject(null);
        this.logInBehavior = new BehaviorSubject(null);
        this.createNewUserBehavior = new BehaviorSubject(null);
        this.resetPasswordBehavior = new BehaviorSubject(null);
    }

    logIn(credentials: Credentials): Observable<User> {
        throw new Error("Method not implemented.");
    }

    logOut(): Observable<void> {
        throw new Error("Method not implemented.");
    }

    createNewUser(credentials: Credentials): Observable<User> {
        return this.createNewUserBehavior.asObservable();
    }

    resetPassword(email: string): Observable<void> {
        return this.resetPasswordBehavior.asObservable();
    }

    onUserLogInStateChanged(): Observable<User> {
        return this.userLogInStateChangedBehavior.asObservable();
    }

    //region Mock Setters

    setLogInBehavior(behavior: User | AuthError): void {
        MockAuthService.serBehavior(behavior, this.logInBehavior);
    }

    setCreateNewUserBehavior(behavior: User | AuthError): void {
        MockAuthService.serBehavior(behavior, this.createNewUserBehavior);
    }

    setUserLogInStateChangedBehavior(behavior: User | AuthError): void {
        MockAuthService.serBehavior(behavior, this.userLogInStateChangedBehavior);
    }

    private static serBehavior(behavior: User | AuthError, subject: BehaviorSubject<User>) {
        if (behavior instanceof AuthError) {
            subject.error(behavior);
        }
        else {
            subject.next(behavior);
        }
    }

    //endregion

}


