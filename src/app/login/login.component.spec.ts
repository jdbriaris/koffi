import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {LoginComponent} from "./login.component";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AUTH_SERVICE, LogInResult} from "../services/auth.service";
import Spy = jasmine.Spy;
import {RouterStub} from "../testing/router.stub";
import {AuthServiceStub} from "../testing/auth.service.stub";

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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [LoginComponent],
            providers: [
                {provide: AUTH_SERVICE, useClass: AuthServiceStub},
                {provide: Router, useClass: RouterStub}
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        loginPage = new LoginPage(fixture);
        fixture.detectChanges(); // calls ngOnInit
    });

    it('should have a title displaying "Log in"', () => {
        de = fixture.debugElement.query(By.css('.form-title'));
        el = de.nativeElement;
        expect(el.textContent).toContain('Log in');
    });

    it('should have a button displaying "Log in"', () => {
        expect(loginPage.loginButton.nativeElement.textContent).toContain('Log in');
    });

    it('should have a button displaying "Forgot password"', () => {
        expect(loginPage.forgotPasswordButton.nativeElement.textContent).toContain('Forgot my password');
    });

    it('should have a button displaying "Create your koffi account"', () => {
        expect(loginPage.registerButton.nativeElement.textContent).toContain('Create your koffi account');
    });

    it('should display an error when email not set and user attempts to login', () => {
        loginPage.userEntersEmail('').userPressesLogIn();
        fixture.detectChanges();
        let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
        expect(emailError.textContent).toBe('Enter your email address');
    });

    it('should display an error when password not set and user attempts to login', () => {
        loginPage.userEntersPassword('').userPressesLogIn();
        fixture.detectChanges();
        let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
        expect(passwordError.textContent).toBe('Enter your password');
    });

    it('should display an error when password not set and user attempts to login', () => {
        loginPage.userEntersPassword('').userPressesLogIn();
        fixture.detectChanges();
        let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
        expect(passwordError.textContent).toBe('Enter your password');
    });

    describe('calls logIn on AuthService', () => {
        let authService: AuthServiceStub;
        let authServiceSpy: Spy;

        beforeEach(() => {
            authService = fixture.debugElement.injector.get(AUTH_SERVICE);
            authServiceSpy = spyOn(authService, 'logIn').and.callThrough();
        });

        it('0 times if user has not entered email', () => {
            loginPage.userEntersEmail('').userEntersPassword('password').userPressesLogIn();
            expect(authServiceSpy.calls.any()).toEqual(false);
        });

        it('0 times if user has not entered password', () => {
            loginPage.userEntersEmail('email').userEntersPassword('').userPressesLogIn();
            expect(authServiceSpy.calls.any()).toEqual(false);
        });

        it('0 times if user has not entered email or password', () => {
            loginPage.userEntersEmail('').userEntersPassword('').userPressesLogIn();
            expect(authServiceSpy.calls.any()).toEqual(false);
        });

        it('1 time if user has entered email and password', () => {
            loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
            expect(authServiceSpy).toHaveBeenCalledTimes(1);
        });

        it('and shows log in error if log in failed', () => {
            authService.setLogInResult(LogInResult.Failed);
            loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
            fixture.detectChanges();
            let passwordError = fixture.debugElement.query(By.css('#login-error')).nativeElement;
            expect(passwordError.textContent).toBe('There was a problem logging in');
        });

        it('and removes entered password if log in failed', () => {
            authService.setLogInResult(LogInResult.Failed);
            loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
            fixture.detectChanges();
            expect(loginPage.passwordInput.value).toBe('');
        });

        describe('and navigates to', () => {
            let router: RouterStub;
            let routerSpy: Spy;

            beforeEach(() => {
                router = fixture.debugElement.injector.get(Router);
                routerSpy = spyOn(router, 'navigate').and.callThrough();
            });

            it('home when log in successful', () => {
                authService.setLogInResult(LogInResult.Success);
                loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
                expect(routerSpy).toHaveBeenCalledTimes(1);
                expect(routerSpy).toHaveBeenCalledWith(['/home']);
            });

            it('register when user has clicked to create an account', () => {
                loginPage.userPressesRegisterButton();
                expect(routerSpy).toHaveBeenCalledTimes(1);
                expect(routerSpy).toHaveBeenCalledWith(['/register']);
            });

            it('forgot password when user has clicked forgot password', () => {
                loginPage.userPressesForgotPasswordButton();
                expect(routerSpy).toHaveBeenCalledTimes(1);
                expect(routerSpy).toHaveBeenCalledWith(['/forgot-password']);
            });
        });
    });

});
