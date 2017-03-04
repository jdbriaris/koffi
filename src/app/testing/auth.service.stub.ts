import {Injectable} from "@angular/core";
import {AuthService, LogInResult, CreateUserResult, LoginCredentials} from "../services/auth.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {NewUser} from "../domain/user.interface";

@Injectable()
export class AuthServiceStub implements AuthService {
    private logInBehavior = new BehaviorSubject(LogInResult.Failed);
    private createUserBehavior = new BehaviorSubject(CreateUserResult.Failed);
    logInParams = this.logInBehavior.asObservable();
    createUserParams = this.createUserBehavior.asObservable();

    logIn(credentials: LoginCredentials): Observable<LogInResult> {
        return this.logInParams;
    }

    logOut(): void {
    }

    createUser(newUser: NewUser): Observable<CreateUserResult> {
        return this.createUserParams;
    }

    isUserLoggedIn(): boolean {
        return undefined;
    }

    setLogInResult(result: LogInResult){
        this.logInBehavior.next(result);
    }

    setCreateUserResult(result: CreateUserResult){
        this.createUserBehavior.next(result);
    }
}