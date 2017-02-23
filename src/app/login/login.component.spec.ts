import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {LoginComponent} from "./login.component";
import {DebugElement, Injectable, Inject} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AUTH_SERVICE, AuthService} from "../services/auth.service";
import {Observable} from "rxjs/Observable";
import {NewUser} from "../domain/user.interface";
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

    userEntersEmail(email: string) : LoginPage {
        this.emailInput.value = email;
        this.emailInput.dispatchEvent(new Event('input'));
        return this;
    }

    userEntersPassword(password: string) : LoginPage {
        this.passwordInput.value = password;
        this.passwordInput.dispatchEvent(new Event('input'));
        return this;
    }

    userPressesLogIn() : LoginPage {
        this.loginForm.triggerEventHandler('ngSubmit', this.loginForm);
        return this;
    }
}

@Injectable()
class AuthServiceStub implements AuthService {

    private subject = new BehaviorSubject(true);
    params = this.subject.asObservable();

    logIn(): Observable<boolean> {
        return this.params;
    }

    logOut(): void {
    }

    // createUser(newUser: NewUser): Observable<NewUser> {
    //     return undefined;
    // }
}

describe('A LoginComponent', () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let loginPage: LoginPage;

    let routerStub = {
        navigateByUrl(url: string) { return url; }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule ],
            declarations: [ LoginComponent ],
            providers: [
                {provide: AUTH_SERVICE, useClass: AuthServiceStub},
                {provide: Router, useValue: routerStub}
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

    describe('calls logIn on AuthService', () => {
        let authService: AuthService;
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
    });

});
