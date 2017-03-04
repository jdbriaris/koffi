import {Injectable} from "@angular/core";
import {AuthService, LogInResult, LoginCredentials, NewUser, User, CreateUserError} from "../services/auth.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class AuthServiceStub implements AuthService {
    private logInBehavior;
    private createUserBehavior;
    logInParams: Observable<LogInResult>;
    createUserParams: Observable<User>;

    constructor(){
        let user: User;
        user = {name: "name",  email: "password", uid: "uid"};
        this.logInBehavior = new BehaviorSubject(LogInResult.Failed);
        this.createUserBehavior = new BehaviorSubject(user);
        this.logInParams = this.logInBehavior.asObservable();
        this.createUserParams = this.createUserBehavior.asObservable();
    }

    logIn(credentials: LoginCredentials): Observable<LogInResult> {
        return this.logInParams;
    }

    logOut(): void {
    }

    createUser(newUser: NewUser): Observable<User> {
        return this.createUserParams;
    }

    isUserLoggedIn(): boolean {
        return undefined;
    }

    setLogInResult(result: LogInResult){
        this.logInBehavior.next(result);
    }

    setCreateUserResult(user: User){
        this.createUserBehavior.next(user);
    }

    setCreateUserError(err: CreateUserError){
        this.createUserBehavior.error(err);
    }
}