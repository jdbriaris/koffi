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
import 'rxjs/add/observable/throw';

//region Test Variables
let component: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;
let page: Page;
//endregion

//region Tests
describe('LoginComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [LoginComponent],
            providers: [
                {provide: AUTH_SERVICE, useClass: MockAuthService},
                {provide: Router, useClass: MockRouter},
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        createComponent();
    }));

    describe('on initialize should render', renderTests);
    describe('when user logs in', logInTests);
    describe('when user navigates', navigateTests);
});

function renderTests() {
    it('a title displaying "Log in"', () => {
        expect(page.formTitle.textContent).toBe('Log in');
    });

    it('a button displaying "Log in"', () => {
        expect(page.loginButton.nativeElement.textContent).toContain('Log in');
    });

    it('a button displaying "Forgot password"', () => {
        expect(page.forgotPasswordButton.nativeElement.textContent).toContain('Forgot my password');
    });

    it('a button displaying "Create your koffi account"', () => {
        expect(page.registerButton.nativeElement.textContent).toContain('Create your koffi account');
    });
}
function logInTests() {
    let credentials: Credentials = { email: MockUser.email, password: "******" };

    it('without email does not call logIn on AuthService and renders email error',
        inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'logIn');

            page.userEntersPassword(credentials.password).userPressesLogIn();
            fixture.detectChanges();

            let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
            expect(emailError.textContent).toBe('Enter your email address');
            expect(spy.calls.any()).toEqual(false);
    }));

    it('without password does not call logIn on AuthService and renders password error',
        inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'logIn');

            page.userEntersEmail(credentials.email).userPressesLogIn();
            fixture.detectChanges();

            let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
            expect(passwordError.textContent).toBe('Enter your password');
            expect(spy.calls.any()).toEqual(false);
    }));

    it('with correct email and password calls logIn on AuthService and navigates to home',
        inject([AUTH_SERVICE, Router, ActivatedRoute],
        (authService: AuthService, router: Router, route: ActivatedRoute) => {
             const spyAuthService = spyOn(authService, 'logIn')
                 .and.returnValue(Observable.create(obs => obs.next(MockUser)));
             const spyRouter = spyOn(router, 'navigate');
             spyOnProperty(route, 'root', 'get').and.returnValue("root");

             page.userEntersCredentials(credentials).userPressesLogIn();

             expect(spyAuthService).toHaveBeenCalledWith(credentials);
             expect(spyRouter).toHaveBeenCalledWith(['home'], {relativeTo: "root"});
    }));

    it('with unknown email calls logIn on AuthService, sets form error, clears inputs and rethrows',
        inject([AUTH_SERVICE, Router, ActivatedRoute],
        (authService: AuthService) => {
             const spyAuthService = spyOn(authService, 'logIn')
                 .and.returnValue(Observable.create(obs => obs.error(new UserNotFoundError())));

             try {
                 page.userEntersCredentials(credentials);
                 component.logIn();
             }
             catch (err) {
                 expect(err).toEqual(jasmine.any(UserNotFoundError));
             }
             finally {
                 fixture.detectChanges();
                 expect(spyAuthService).toHaveBeenCalledWith(credentials);
                 let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
                 expect(emailError.textContent).toBe('Sorry, there is no user registered with that email');
                 expect(page.passwordInput.value).toBe('');
                 expect(page.emailInput.value).toBe('');
            }
    }));

    it('with incorrect password calls logIn on AuthService and sets form error and clears password input',
        inject([AUTH_SERVICE, Router, ActivatedRoute],
        (authService: AuthService) => {
             const spyAuthService = spyOn(authService, 'logIn')
                 .and.returnValue(Observable.create(obs => obs.error(new WrongPasswordError())));

            try {
                page.userEntersCredentials(credentials);
                component.logIn();
            }
            catch (err) {
                expect(err).toEqual(jasmine.any(WrongPasswordError));
            }
            finally {
                fixture.detectChanges();
                expect(spyAuthService).toHaveBeenCalledWith(credentials);
                let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
                expect(passwordError.textContent).toBe('Your password is incorrect');
                expect(page.passwordInput.value).toBe('');
            }
    }));

    it('throws AuthError when AuthService logIn errors with AuthError',
        inject([AUTH_SERVICE], (authService: AuthService) => {
        spyOn(authService, 'logIn').and.returnValue(Observable.throw(new AuthError()));

        page.userEntersCredentials(credentials);

        expect(component.logIn.bind(component)).toThrowError(AuthError);
    }));
}
function navigateTests() {
    it('to register by pressing register button',
        inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
            const spyRouter = spyOn(router, 'navigate');
            spyOnProperty(route, 'parent', 'get').and.returnValue("parent");

            page.userPressesRegisterButton();

            expect(spyRouter).toHaveBeenCalledWith(['register'], {relativeTo: "parent"});
    }));

    it('to forgot password by pressing forgot password button',
        inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
            const spyRouter = spyOn(router, 'navigate');
            spyOnProperty(route, 'parent', 'get').and.returnValue("parent");

            page.userPressesForgotPasswordButton();

            expect(spyRouter).toHaveBeenCalledWith(['forgot-password'], {relativeTo: "parent"});
        }));
}

//region Helpers
/** Create the LoginComponent, initialize it and set the test variables  */
function createComponent(): Promise<void> {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    page = new Page();

    // Invoke ngOnIt
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
        page.addPageElements();
    });
}

class Page {
    formTitle: HTMLElement;
    loginForm: DebugElement;
    loginButton: DebugElement;
    registerButton: DebugElement;
    forgotPasswordButton: DebugElement;
    emailInput: HTMLInputElement;
    passwordInput: HTMLInputElement;

    public addPageElements() {
        this.formTitle = fixture.debugElement.query(By.css('.form-title')).nativeElement;
        this.loginForm = fixture.debugElement.query(By.css('.form-container'));
        this.loginButton = fixture.debugElement.query(By.css('#login-button'));
        this.registerButton = fixture.debugElement.query(By.css('#register-button'));
        this.forgotPasswordButton = fixture.debugElement.query(By.css('#forgot-password-button'));
        this.emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
        this.passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;
    }

    userEntersEmail(email: string): Page {
        this.emailInput.value = email;
        this.emailInput.dispatchEvent(new Event('input'));
        return this;
    }

    userEntersPassword(password: string): Page {
        this.passwordInput.value = password;
        this.passwordInput.dispatchEvent(new Event('input'));
        return this;
    }

    userEntersCredentials(credentials: Credentials): Page {
        return this.userEntersEmail(credentials.email)
            .userEntersPassword(credentials.password);
    }

    userPressesLogIn(): Page {
        this.loginForm.triggerEventHandler('ngSubmit', this.loginForm);
        return this;
    }

    userPressesRegisterButton(): Page {
        this.registerButton.triggerEventHandler('click', null);
        return this;
    }

    userPressesForgotPasswordButton(): Page {
        this.forgotPasswordButton.triggerEventHandler('click', null);
        return this;
    }
}
//endregion


