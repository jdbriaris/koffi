import {DebugElement} from "@angular/core";
import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {ForgotPasswordComponent} from "./forgot-password.component";
import {By} from "@angular/platform-browser";
import {RouterStub} from "../../testing/router.stub";
import {Router} from "@angular/router";
import {AUTH_SERVICE} from "../services/auth.service";
import {ReactiveFormsModule} from "@angular/forms";
import Spy = jasmine.Spy;

class ForgotPasswordPage {
    resetPasswordForm: DebugElement;
    emailInput: HTMLInputElement;
    continueButton: DebugElement;

    constructor(private fixture: ComponentFixture<ForgotPasswordComponent>){
        this.queryDomElements(fixture);
    }

    private queryDomElements(fixture: ComponentFixture<ForgotPasswordComponent>) {
        this.resetPasswordForm = fixture.debugElement.query(By.css('.form-container'));
        this.emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
        this.continueButton = fixture.debugElement.query(By.css('#continue-button'));
    }

    userEntersEmail(email: string): ForgotPasswordPage {
        this.emailInput.value = email;
        this.emailInput.dispatchEvent(new Event('input'));
        return this;
    }

    userPressesContinue(): ForgotPasswordPage {
        this.resetPasswordForm.triggerEventHandler('ngSubmit', this.resetPasswordForm);
        return this;
    }
}


// describe('ForgotPasswordComponent', () => {
//     let component: ForgotPasswordComponent;
//     let fixture: ComponentFixture<ForgotPasswordComponent>;
//     let page: ForgotPasswordPage;
//     let de: DebugElement;
//     let el: HTMLElement;
//
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [ReactiveFormsModule],
//             declarations: [ForgotPasswordComponent],
//             providers: [
//                 {provide: AUTH_SERVICE, useClass: AuthServiceStub},
//                 {provide: Router, useClass: RouterStub}
//             ]
//         });
//     }));
//
//     beforeEach(() => {
//         fixture = TestBed.createComponent(ForgotPasswordComponent);
//         component = fixture.componentInstance;
//         page = new ForgotPasswordPage(fixture);
//         fixture.detectChanges(); // calls ngOnInit
//     });
//
//     it('should have a title displaying "Reset Password"', () => {
//         de = fixture.debugElement.query(By.css('.form-title'));
//         el = de.nativeElement;
//         expect(el.textContent).toContain('Reset Password');
//     });
//
//     it('should have a button displaying "Continue"', () => {
//         expect(page.continueButton.nativeElement.textContent).toContain('Continue');
//     });
//
//     it('should display an error when email not set and user attempts to continue', () => {
//         page.userEntersEmail('').userPressesContinue();
//         fixture.detectChanges();
//         let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
//         expect(emailError.textContent).toBe('Enter your email address');
//     });
//
//     describe('calls resetPassword on AuthService', () => {
//         let authService: AuthServiceStub;
//         let authServiceSpy: Spy;
//
//         beforeEach(() => {
//             authService = fixture.debugElement.injector.get(AUTH_SERVICE);
//             authServiceSpy = spyOn(authService, 'resetPassword').and.callThrough();
//         });
//
//         it('0 times if user enters an invalid email', () => {
//             page.userEntersEmail('').userPressesContinue();
//             expect(authServiceSpy.calls.any()).toBeFalsy();
//         });
//
//         it('shows invalid email error if AuthService returns invalid email', () => {
//             authService.setResetPasswordError(ResetPasswordError.InvalidEmail);
//             page.userEntersEmail('some invalid email').userPressesContinue();
//             fixture.detectChanges();
//             let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
//             expect(emailError.textContent).toBe('Enter a valid email address');
//         });
//
//         it('removes email input if AuthService returns invalid email', () => {
//             authService.setResetPasswordError(ResetPasswordError.InvalidEmail);
//             page.userEntersEmail('some invalid email').userPressesContinue();
//             fixture.detectChanges();
//             expect(page.emailInput.value).toBe('');
//         });
//
//         it('clears invalid email error if AuthService returns invalid email and user starts entering new email', () => {
//             authService.setResetPasswordError(ResetPasswordError.InvalidEmail);
//             page.userEntersEmail('some invalid email').userPressesContinue();
//             fixture.detectChanges();
//             page.userEntersEmail('s');
//             fixture.detectChanges();
//             expect(fixture.debugElement.query(By.css('#email-error'))).toBeNull();
//         });
//
//         it('shows user not found error if AuthService returns user not found', () => {
//             authService.setResetPasswordError(ResetPasswordError.UserNotFound);
//             page.userEntersEmail('someone@somewhere.com').userPressesContinue();
//             fixture.detectChanges();
//             let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
//             expect(emailError.textContent).toBe('Sorry, there is no user registered with that email');
//         });
//
//         it('removes email input if AuthService returns user not found', () => {
//             authService.setResetPasswordError(ResetPasswordError.UserNotFound);
//             page.userEntersEmail('someone@somewhere.com').userPressesContinue();
//             fixture.detectChanges();
//             expect(page.emailInput.value).toBe('');
//         });
//
//         it('clears user not found error if AuthService returns invalid email and user starts entering new email', () => {
//             authService.setResetPasswordError(ResetPasswordError.UserNotFound);
//             page.userEntersEmail('someone@somewhere.com').userPressesContinue();
//             fixture.detectChanges();
//             page.userEntersEmail('s');
//             fixture.detectChanges();
//             expect(fixture.debugElement.query(By.css('#email-error'))).toBeNull();
//         });
//
//     })
//
// });