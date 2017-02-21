import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {LoginComponent} from "./login.component";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {FirebaseAuthService} from "../services/firebase.auth.service";
import {Router} from "@angular/router";
import {AUTH_SERVICE} from "../services/auth.service";

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

describe('LoginComponent', () => {

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
                {provide: AUTH_SERVICE, useValue: FirebaseAuthService},
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

    it('it should have title displaying "Log in"', () => {
        de = fixture.debugElement.query(By.css('.form-title'));
        el = de.nativeElement;
        expect(el.textContent).toContain('Log in');
    });

    it('should have button displaying "Log in"', () => {
        expect(loginPage.loginButton.nativeElement.textContent).toContain('Log in');
    });

    it('should display error when email not set and user attempts to login', () => {
        loginPage.userEntersEmail('').userPressesLogIn();
        fixture.detectChanges();
        let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
        expect(emailError.textContent).toBe('Enter your email address');
    });

    it('should display error when password not set and user attempts to login', () => {
        loginPage.userEntersPassword('').userPressesLogIn();
        fixture.detectChanges();
        let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
        expect(passwordError.textContent).toBe('Enter your password');
    });

});
