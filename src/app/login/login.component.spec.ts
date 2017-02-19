import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {LoginComponent} from "./login.component";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

class LoginPage {
    loginForm: DebugElement;
    loginButton: DebugElement;
    registerButton: DebugElement;
    emailInput: HTMLInputElement;
    passwordInput: HTMLInputElement;

    constructor(private fixture: ComponentFixture<LoginComponent>) {
        this.loginForm = fixture.debugElement.query(By.css('.form-container'));
        this.loginButton = fixture.debugElement.query(By.css('#login-button'));
        this.registerButton = fixture.debugElement.query(By.css('#register-button'));
        this.emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
        this.passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;
    }
}


describe('LoginComponent', () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let loginPage: LoginPage;

    let emailError: HTMLElement;

    let authServiceStub = {
        isLoggedIn: false
    };

    let routerStub = {
        navigateByUrl(url: string) { return url; }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule ],
            declarations: [ LoginComponent ],
            providers: [
                {provide: AuthService, useValue: authServiceStub},
                {provide: Router, useValue: routerStub}
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        loginPage = new LoginPage(fixture);
    });

    it('it should have title displaying "Log in"', () => {
        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('.form-title'));
        el = de.nativeElement;
        expect(el.textContent).toContain('Log in');
    });

    it('should have button displaying "Log in"', () => {
        fixture.detectChanges();
        expect(loginPage.loginButton.nativeElement.textContent).toContain('Log in');
    });

    it('should display error when email not present', () => {
        // This will build the form
        fixture.detectChanges();

        // simulate user entering email into email input box
        loginPage.emailInput.value = '';
        loginPage.emailInput.dispatchEvent(new Event('input'));

        // simulate user pressing login button
        loginPage.loginForm.triggerEventHandler('ngSubmit', loginPage.loginForm);

        // ngIf should be showing element by now
        emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;

        // wait for form to be updated
        fixture.detectChanges();

        // the error message we expect
        expect(emailError.textContent).toBe('Enter your email address');
    });

});
