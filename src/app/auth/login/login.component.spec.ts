import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {LoginComponent} from "./login.component";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AUTH_SERVICE, AuthService} from "../services/auth.service";
import Spy = jasmine.Spy;
import {RouterStub} from "../../testing/router.stub";
import createSpyObj = jasmine.createSpyObj;
import {User} from "../user";

import * as TypeMoq from 'typemoq';


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

describe('A LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let loginPage: LoginPage;
    let activatedRoute: ActivatedRoute;

    let mockAuthService: TypeMoq.IMock<AuthService>;

    // beforeEach(async(() => {
    //
    //
    //
    //
    //     activatedRoute = createSpyObj<ActivatedRoute>('activatedRoute', ['root', 'parent']);
    //     TestBed.configureTestingModule({
    //         imports: [ReactiveFormsModule],
    //         declarations: [LoginComponent],
    //         providers: [
    //             {provide: AUTH_SERVICE, useClass: mockAuthService.object},
    //             {provide: Router, useClass: MockRouter},
    //             {provide: ActivatedRoute, useValue: activatedRoute}
    //         ]
    //     });
    // }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        loginPage = new LoginPage(fixture);
        fixture.detectChanges(); // calls ngOnInit
    });
//
//     it('should have a title displaying "Log in"', () => {
//         de = fixture.debugElement.query(By.css('.form-title'));
//         el = de.nativeElement;
//         expect(el.textContent).toContain('Log in');
//     });
//
//     it('should have a button displaying "Log in"', () => {
//         expect(loginPage.loginButton.nativeElement.textContent).toContain('Log in');
//     });
//
//     it('should have a button displaying "Forgot password"', () => {
//         expect(loginPage.forgotPasswordButton.nativeElement.textContent).toContain('Forgot my password');
//     });
//
//     it('should have a button displaying "Create your koffi account"', () => {
//         expect(loginPage.registerButton.nativeElement.textContent).toContain('Create your koffi account');
//     });
//
//     it('should display an error when email not set and user attempts to login', () => {
//         loginPage.userEntersEmail('').userPressesLogIn();
//         fixture.detectChanges();
//         let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
//         expect(emailError.textContent).toBe('Enter your email address');
//     });
//
//     it('should display an error when password not set and user attempts to login', () => {
//         loginPage.userEntersPassword('').userPressesLogIn();
//         fixture.detectChanges();
//         let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
//         expect(passwordError.textContent).toBe('Enter your password');
//     });
//
//     it('should display an error when password not set and user attempts to login', () => {
//         loginPage.userEntersPassword('').userPressesLogIn();
//         fixture.detectChanges();
//         let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
//         expect(passwordError.textContent).toBe('Enter your password');
//     });
//
//     describe('calls logIn on AuthService', () => {
//         const name = 'name';
//         const email = 'email';
//         const password = 'password';
//         let authService: AuthServiceStub;
//         let authServiceSpy: Spy;
//         let user: User;
//
//         beforeEach(() => {
//             authService = fixture.debugElement.injector.get(AUTH_SERVICE);
//             authServiceSpy = spyOn(authService, 'logIn').and.callThrough();
//             user = {
//                 name: name,
//                 email: email,
//                 uid: 'uid'
//             };
//         });
//
//         it('0 times if user has not entered email', () => {
//             loginPage.userEntersEmail('').userEntersPassword('password').userPressesLogIn();
//             expect(authServiceSpy.calls.any()).toEqual(false);
//         });
//
//         it('0 times if user has not entered password', () => {
//             loginPage.userEntersEmail('email').userEntersPassword('').userPressesLogIn();
//             expect(authServiceSpy.calls.any()).toEqual(false);
//         });
//
//         it('0 times if user has not entered email or password', () => {
//             loginPage.userEntersEmail('').userEntersPassword('').userPressesLogIn();
//             expect(authServiceSpy.calls.any()).toEqual(false);
//         });
//
//         it('1 time if user has entered email and password', () => {
//             loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
//             expect(authServiceSpy).toHaveBeenCalledTimes(1);
//         });
//
//         it('and shows log in problem error if log in failed', () => {
//             authService.setLogInError(LogInError.Failed);
//             loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
//             fixture.detectChanges();
//             let passwordError = fixture.debugElement.query(By.css('#login-error')).nativeElement;
//             expect(passwordError.textContent).toBe('There was a problem logging in');
//         });
//
//         it('and shows log in problem error if log in failed', () => {
//             authService.setLogInError(LogInError.Failed);
//             loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
//             fixture.detectChanges();
//             let passwordError = fixture.debugElement.query(By.css('#login-error')).nativeElement;
//             expect(passwordError.textContent).toBe('There was a problem logging in');
//         });
//
//         it('and removes entered password if log in failed', () => {
//             authService.setLogInError(LogInError.Failed);
//             loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
//             fixture.detectChanges();
//             expect(loginPage.passwordInput.value).toBe('');
//         });
//
//         describe('and navigates to', () => {
//             let router: RouterStub;
//             let routerSpy: Spy;
//
//             beforeEach(() => {
//                 router = fixture.debugElement.injector.get(Router);
//                 routerSpy = spyOn(router, 'navigate').and.callThrough();
//             });
//
//             it('home when log in successful', () => {
//                 authService.setLogInResult(user);
//                 loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
//                 expect(routerSpy).toHaveBeenCalledTimes(1);
//                 expect(routerSpy).toHaveBeenCalledWith(['home'], {relativeTo: activatedRoute.root});
//             });
//
//             it('register when user has clicked to create an account', () => {
//                 loginPage.userPressesRegisterButton();
//                 expect(routerSpy).toHaveBeenCalledTimes(1);
//                 expect(routerSpy).toHaveBeenCalledWith(['register'], {relativeTo: activatedRoute.parent});
//             });
//
//             it('forgot password when user has clicked forgot password', () => {
//                 loginPage.userPressesForgotPasswordButton();
//                 expect(routerSpy).toHaveBeenCalledTimes(1);
//                 expect(routerSpy).toHaveBeenCalledWith(['forgot-password'], {relativeTo: activatedRoute.parent});
//             });
//         });
//     });
//
});
