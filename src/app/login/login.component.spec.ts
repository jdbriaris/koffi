import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {LoginComponent} from "./login.component";
import {DebugElement, Injectable} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AUTH_SERVICE, AuthService, LogInResult} from "../services/auth.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import Spy = jasmine.Spy;

class LoginPage {
    loginForm: DebugElement;
    loginButton: DebugElement;
    registerButton: DebugElement;
    emailInput: HTMLInputElement;
    passwordInput: HTMLInputElement;

    constructor(private fixture: ComponentFixture<LoginComponent>) {
        this.queryDomElements(fixture);
    }

    private queryDomElements(fixture: ComponentFixture<LoginComponent>) {
        this.loginForm = fixture.debugElement.query(By.css('.form-container'));
        this.loginButton = fixture.debugElement.query(By.css('#login-button'));
        this.registerButton = fixture.debugElement.query(By.css('#register-button'));
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
}

@Injectable()
class AuthServiceStub implements AuthService {
    private subject = new BehaviorSubject(LogInResult.Failed);
    params = this.subject.asObservable();

    logIn(): Observable<LogInResult> {
        return this.params;
    }

    logOut(): void {
    }

    setLogInSuccessful(success: LogInResult){
        this.subject.next(success);
    }
}

@Injectable()
class RouterStub {
    navigate() {};
}

describe('A LoginComponent', () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let loginPage: LoginPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule ],
            declarations: [ LoginComponent ],
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
            authService.setLogInSuccessful(LogInResult.Failed);
            loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
            fixture.detectChanges();
            let passwordError = fixture.debugElement.query(By.css('#login-error')).nativeElement;
            expect(passwordError.textContent).toBe('There was a problem logging in');
        });

        it('and removes entered password if log in failed', () => {
            authService.setLogInSuccessful(LogInResult.Failed);
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
                authService.setLogInSuccessful(LogInResult.Success);
                loginPage.userEntersEmail('email').userEntersPassword('password').userPressesLogIn();
                expect(routerSpy).toHaveBeenCalledTimes(1);
                expect(routerSpy).toHaveBeenCalledWith(['/home']);
            });

            it('register when user has clicked to create an account', () => {
                loginPage.userPressesRegisterButton();
                expect(routerSpy).toHaveBeenCalledTimes(1);
                expect(routerSpy).toHaveBeenCalledWith(['/register']);
            });
        });
    });

});
