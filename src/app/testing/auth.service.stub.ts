import {Injectable} from "@angular/core";
import {
    AuthService, LogInError, LoginCredentials, NewUser, User, CreateUserError,
    ResetPasswordError
} from "../services/auth.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class AuthServiceStub implements AuthService {
    private logInBehavior: BehaviorSubject<User>;
    private createUserBehavior: BehaviorSubject<User>;
    private resetPasswordBehavior;
    private userLogInStateChangedBehavior: BehaviorSubject<User>;
    logInParams: Observable<User>;
    createUserParams: Observable<User>;
    resetPasswordParams: Observable<void>;
    userLogInStateChangedObs: Observable<User>;

    constructor(){
        let user: User;
        user = {name: "name",  email: "password", uid: "uid"};

        this.logInBehavior = new BehaviorSubject(user);
        this.createUserBehavior = new BehaviorSubject(user);
        this.userLogInStateChangedBehavior = new BehaviorSubject(user);
        this.resetPasswordBehavior = new BehaviorSubject(ResetPasswordError.InavlidEmail);

        this.logInParams = this.logInBehavior.asObservable();
        this.createUserParams = this.createUserBehavior.asObservable();
        this.resetPasswordParams = this.resetPasswordBehavior.asObservable();
        this.userLogInStateChangedObs = this.userLogInStateChangedBehavior.asObservable();
    }

    logIn(credentials: LoginCredentials): Observable<User> {
        return this.logInParams;
    }

    logOut(): Observable<void> {
        return undefined;
    }

    onUserLogInStateChanged(): Observable<User> {
        return this.userLogInStateChangedObs;
    }

    resetPassword(email: string): Observable<void> {
        return this.resetPasswordParams;
    }

    createUser(newUser: NewUser): Observable<User> {
        return this.createUserParams;
    }

    isUserLoggedIn(): boolean {
        return undefined;
    }

    setLogInResult(user: User){
        this.logInBehavior.next(user);
    }

    setLogInError(err: LogInError){
        this.logInBehavior.error(err);
    }

    setCreateUserResult(user: User){
        this.createUserBehavior.next(user);
    }

    setCreateUserError(err: CreateUserError){
        this.createUserBehavior.error(err);
    }

    setResetPasswordError(err: ResetPasswordError) {
        this.resetPasswordBehavior.error(err);
    }

    setUserLogInStateChangedResult(user: User) {
        this.userLogInStateChangedBehavior.next(user);
    }
}