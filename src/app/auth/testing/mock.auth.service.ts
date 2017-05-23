import {AuthService, CreateUserError, LoginCredentials, LogInError, NewUser} from "../services/auth.service";
import {Observable} from "rxjs/Observable";
import {User} from "../user";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Injectable} from "@angular/core";
import {isUser} from "../../utils/utils";

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

    logIn(credentials: LoginCredentials): Observable<User> {
        return this.logInBehavior.asObservable();
    }

    logOut(): Observable<void> {
        throw new Error("Method not implemented.");
    }

    createNewUser(newUser: NewUser): Observable<User> {
        return this.createNewUserBehavior.asObservable();
    }

    resetPassword(email: string): Observable<void> {
        return this.resetPasswordBehavior.asObservable();
    }

    onUserLogInStateChanged(): Observable<User> {
        return this.userLogInStateChangedBehavior.asObservable();
    }

    //region Mock Setters

    setLogInBehavior(behavior: User | LogInError): void {
        if (isUser(behavior)) {
            this.logInBehavior.next(behavior);
        }
        else {
            this.logInBehavior.error(behavior);
        }
    }

    setCreateNewUserBehavior(behavior: User | CreateUserError): void {
        if (isUser(behavior)) {
            this.createNewUserBehavior.next(behavior);
        }
        else {
            this.createNewUserBehavior.error(behavior);
        }
    }

    setUserLogInStateChangedBehavior(user: User): void {
        this.userLogInStateChangedBehavior.next(user);
    }


    //endregion

}


