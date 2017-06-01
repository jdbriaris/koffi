import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {LoginComponent} from "./login.component";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AUTH_SERVICE, AuthService, Credentials} from "../services/auth.service";
import Spy = jasmine.Spy;
import {RouterStub} from "../../testing/router.stub";
import createSpyObj = jasmine.createSpyObj;
import {User} from "../user";
import * as TypeMoq from 'typemoq';
import {MockRouter} from "../../testing/mock.router";
import {MockAuthService} from "../testing/mock.auth.service";
import {MockUser} from "../testing/mock.user";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {MockActivatedRoute} from "../../testing/mock.activated.route";
import {inject} from "@angular/core/testing";
import * as firebase from "firebase/app";
import Auth = firebase.auth.Auth;
import {Observable} from "rxjs/Observable";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { WrongPasswordError } from "../errors/wrong-password.error";
import { AuthError } from "../errors/auth.error";


class LoginPage {
    loginForm: DebugElement;
    loginButton: DebugElement;
    registerButton: DebugElement;
    forgotPasswordButton: DebugElement;
    emailInput: HTMLInputElement;
    passwordInput: HTMLInputElement;

    constructor(private fixture: ComponentFixture<LoginComponent>) {
        this.queryDomElements(fixture);
    }

    private queryDomElements(fixture: ComponentFixture<LoginComponent>) {
        this.loginForm = fixture.debugElement.query(By.css('.form-container'));
        this.loginButton = fixture.debugElement.query(By.css('#login-button'));
        this.registerButton = fixture.debugElement.query(By.css('#register-button'));
        this.forgotPasswordButton = fixture.debugElement.query(By.css('#forgot-password-button'));
        this.emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
        this.passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;
    }

    userEntersEmail(email: string): LoginPage {
        this.emailInput.value = email;
        this.emailInput.dispatchEvent(new Event('input'));
        return this;
    }

    userEntersPassword(password: string): LoginPage {
        this.passwordInput.value = password;
        this.passwordInput.dispatchEvent(new Event('input'));
        return this;
    }

    userEntersCredentials(credentials: Credentials): LoginPage {
        return this.userEntersEmail(credentials.email)
            .userEntersPassword(credentials.password);
    }

    userPressesLogIn(): LoginPage {
        this.loginForm.triggerEventHandler('ngSubmit', this.loginForm);
        return this;
    }

    userPressesRegisterButton(): LoginPage {
        this.registerButton.triggerEventHandler('click', null);
        return this;
    }

    userPressesForgotPasswordButton(): LoginPage {
        this.forgotPasswordButton.triggerEventHandler('click', null);
        return this;
    }
}

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let loginPage: LoginPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [LoginComponent],
            providers: [
                {provide: AUTH_SERVICE, useClass: MockAuthService},
                {provide: Router, useClass: MockRouter},
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        loginPage = new LoginPage(fixture);
        fixture.detectChanges(); // calls ngOnInit
    });

    describe('should render', () => {
        it('a title displaying "Log in"', () => {
            de = fixture.debugElement.query(By.css('.form-title'));
            el = de.nativeElement;
            expect(el.textContent).toContain('Log in');
        });

        it('a button displaying "Log in"', () => {
            expect(loginPage.loginButton.nativeElement.textContent).toContain('Log in');
        });

        it('a button displaying "Forgot password"', () => {
            expect(loginPage.forgotPasswordButton.nativeElement.textContent).toContain('Forgot my password');
        });

        it('a button displaying "Create your koffi account"', () => {
            expect(loginPage.registerButton.nativeElement.textContent).toContain('Create your koffi account');
        });
    });

    describe('logIn', () => {
        let credentials: Credentials = { email: MockUser.email, password: "******" };

        it('does not call logIn on AuthService and renders email error when user attempts to login without email',
            inject([AUTH_SERVICE], (authService: AuthService) => {
                const spy = spyOn(authService, 'logIn');

                loginPage.userEntersPassword(credentials.password).userPressesLogIn();
                fixture.detectChanges();

                let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
                expect(emailError.textContent).toBe('Enter your email address');
                expect(spy.calls.any()).toEqual(false);
        }));

        it('does not call logIn on AuthService and renders password error when user attempts to login without password',
            inject([AUTH_SERVICE], (authService: AuthService) => {
                const spy = spyOn(authService, 'logIn');

                loginPage.userEntersEmail(credentials.email).userPressesLogIn();
                fixture.detectChanges();

                let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
                expect(passwordError.textContent).toBe('Enter your password');
                expect(spy.calls.any()).toEqual(false);
        }));

        it('calls logIn on AuthService and navigates to home when user logs in with correct email and password',
            inject([AUTH_SERVICE, Router, ActivatedRoute], 
            (authService: AuthService, router: Router, route: ActivatedRoute) => {
                 const spyAuthService = spyOn(authService, 'logIn')
                     .and.returnValue(Observable.create(obs => obs.next(MockUser)));
                 const spyRouter = spyOn(router, 'navigate');
                 const spyRoot = spyOnProperty(route, 'root', 'get').and.returnValue("root");

                 loginPage.userEntersCredentials(credentials).userPressesLogIn();

                 expect(spyAuthService).toHaveBeenCalledWith(credentials);
                 expect(spyRouter).toHaveBeenCalledWith(['home'], {relativeTo: "root"});
        }));

        it('calls logIn on AuthService and sets form error and clears input when no user found',
            inject([AUTH_SERVICE, Router, ActivatedRoute], 
            (authService: AuthService) => {
                 const spyAuthService = spyOn(authService, 'logIn')
                     .and.returnValue(Observable.create(obs => obs.error(new UserNotFoundError())));

                 loginPage.userEntersCredentials(credentials).userPressesLogIn();
                 fixture.detectChanges();

                 expect(spyAuthService).toHaveBeenCalledWith(credentials);
                 let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
                 expect(emailError.textContent).toBe('Sorry, there is no user registered with that email');
                 expect(loginPage.passwordInput.value).toBe('');
                 expect(loginPage.emailInput.value).toBe('');
        }));

        it('calls logIn on AuthService and sets form error and clears password input when password incorrect',
            inject([AUTH_SERVICE, Router, ActivatedRoute], 
            (authService: AuthService) => {
                 const spyAuthService = spyOn(authService, 'logIn')
                     .and.returnValue(Observable.create(obs => obs.error(new WrongPasswordError())));

                 loginPage.userEntersCredentials(credentials).userPressesLogIn();
                 fixture.detectChanges();

                 expect(spyAuthService).toHaveBeenCalledWith(credentials);
                 let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
                 expect(passwordError.textContent).toBe('Your password is incorrect');
                 expect(loginPage.passwordInput.value).toBe('');
        }));

        it('throws error if error unknown',
            inject([AUTH_SERVICE, Router, ActivatedRoute], 
            (authService: AuthService) => {
                 const spyAuthService = spyOn(authService, 'logIn')
                     .and.returnValue(Observable.create(obs => obs.error(new AuthError())));

                 loginPage.userEntersCredentials(credentials).userPressesLogIn();
                 
                 expect(component.logIn).toThrowError(AuthError);

        }));


    });

});
