import {DebugElement} from "@angular/core";
import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {ForgotPasswordComponent} from "./forgot-password.component";
import {By} from "@angular/platform-browser";
import {Router} from "@angular/router";
import { AUTH_SERVICE, AuthService } from "../services/auth.service";
import {ReactiveFormsModule} from "@angular/forms";
import Spy = jasmine.Spy;
import { MockAuthService } from "../testing/mock.auth.service";
import { MockRouter } from "../../testing/mock.router";
import { inject } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { InvalidEmailError } from "../errors/invalid-email.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { AuthError } from "../errors/auth.error";

//region Test Vars
let component: ForgotPasswordComponent;
let fixture: ComponentFixture<ForgotPasswordComponent>;
let page: Page;
//endregion

//region Tests
describe('ForgotPasswordComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [ForgotPasswordComponent],
            providers: [
                {provide: AUTH_SERVICE, useClass: MockAuthService},
                {provide: Router, useClass: MockRouter}
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        createComponent();
    }));

    describe('on initialize should render', initializeTests);
    describe('when user presses continue', forgotPasswordTests);
});

function initializeTests(): void {
    it('a title displaying "Create account"', () => {
        expect(page.formTitle.textContent).toBe('Reset Password');
    });

    it('should have a button displaying "Continue"', () => {
        expect(page.continueButton.nativeElement.textContent).toBe('Continue');
    });
}

function forgotPasswordTests(): void {

    it('with no email, should display error, clear input and not call resetPassword on AuthService', 
        inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'resetPassword');

            page.userPressesContinue();
            fixture.detectChanges();

            page.addPageErrorElements();
            expect(page.emailError.nativeElement.textContent).toBe('Enter your email address');
            expect(page.emailInput.value).toBe('');
            expect(spy.calls.any()).toBeFalsy();
    }));

    describe('with email, calls AuthService resetPassword', () => {

        it('and displays error when resetPassword returns InvalidEmailError', 
            inject([AUTH_SERVICE], (authService: AuthService) => {
                const spy = spyOn(authService, 'resetPassword')
                .and.returnValue(Observable.throw(new InvalidEmailError));

                let invalidEmail = 'invalid@email.com';

                page.userEntersEmail(invalidEmail).userPressesContinue();
                fixture.detectChanges();

                page.addPageErrorElements();
                expect(page.emailError.nativeElement.textContent).toBe('Enter a valid email address');
                expect(page.emailInput.value).toBe('');
                expect(spy).toHaveBeenCalledWith(invalidEmail);
        }));

        it('and displays error when resetPassword returns UserNotFoundError', 
            inject([AUTH_SERVICE], (authService: AuthService) => {
                const spy = spyOn(authService, 'resetPassword')
                .and.returnValue(Observable.throw(new UserNotFoundError));

                let invalidEmail = 'no@user.com';

                page.userEntersEmail(invalidEmail).userPressesContinue();
                fixture.detectChanges();

                page.addPageErrorElements();
                expect(page.emailError.nativeElement.textContent).toBe('Sorry, there is no user registered with that email');
                expect(page.emailInput.value).toBe('');
                expect(spy).toHaveBeenCalledWith(invalidEmail);
        }));

        it('should rethrow error when resetPassword returns AuthError',
            inject([AUTH_SERVICE], (authService: AuthService) => {
                const spyAuthService = spyOn(authService, 'resetPassword')
                    .and.returnValue(Observable.throw(new AuthError));

                let invalidEmail = 'no@user.com';
                page.userEntersEmail(invalidEmail);

                expect(component.continue.bind(component)).toThrowError(AuthError);
        }));

    });



    





}
//endregion

//region Helpers
/** Create the LoginComponent, initialize it and set the test variables  */
function createComponent(): Promise<void> {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
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
    resetPasswordForm: DebugElement;
    emailInput: HTMLInputElement;
    emailError: DebugElement;
    continueButton: DebugElement;

    public addPageElements(): void {
        this.formTitle = fixture.debugElement.query(By.css('.form-title')).nativeElement;
        this.resetPasswordForm = fixture.debugElement.query(By.css('.form-container'));
        this.emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
        this.continueButton = fixture.debugElement.query(By.css('#continue-button'));       
    }

    public addPageErrorElements(): void {
        this.emailError = fixture.debugElement.query(By.css('#email-error'));
    }

    userEntersEmail(email: string): Page {
        this.emailInput.value = email;
        this.emailInput.dispatchEvent(new Event('input'));
        return this;
    }

    userPressesContinue(): Page {
        this.resetPasswordForm.triggerEventHandler('ngSubmit', this.resetPasswordForm);
        return this;
    }
}
//endregion


