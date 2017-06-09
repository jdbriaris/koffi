import {DebugElement} from "@angular/core";
import {ComponentFixture, async, TestBed, inject} from "@angular/core/testing";
import {RegisterComponent} from "./register.component";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {AUTH_SERVICE, AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivatedRouteStub, RouterStub} from "../../testing/router.stub";
import Spy = jasmine.Spy;
import {User} from "../user";
import {MockAuthService} from "../testing/mock.auth.service";
import {MockRouter} from "../../testing/mock.router";
import {MockActivatedRoute} from "../../testing/mock.activated.route";
var binaryVariations = require('binary-variations');



//region Test Vars
let component: RegisterComponent;
let fixture: ComponentFixture<RegisterComponent>;
let page: Page;
//endregion

//region Tests
describe('RegisterComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [RegisterComponent],
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

    describe('on initialize should render', initializeTests);
    describe('when user registers', registerTests);
    //describe('when user navigates', navigateTests);
});

function initializeTests(): void {
    it('a title displaying "Create account"', () => {
        expect(page.formTitle.textContent).toBe('Create account');
    });

    it('should have a button displaying "Log in"', () => {
        expect(page.logInButton.nativeElement.textContent).toBe('Log in');
    });

    it('should have a button displaying "Create your koffi account"', () => {
        expect(page.registerButton.nativeElement.textContent).toBe('Create your koffi account');
    });
}

function writeFoo(foo: string): void {
    console.log('foo = ' + foo);
}

function writeBar(bar: string): void {
    console.log('bar = ' + bar);
}

function registerTests(): void {

    describe('with input that', () => {






        // //TODO: Find way to iterate over permutations (look @ heaps-permute on npm)
        // it('is empty should display errors and not call AuthService CreateUser',
        //     inject([AUTH_SERVICE], (authService: AuthService) => {
        //     const spy = spyOn(authService, 'createNewUser');
        //
        //     page.userEntersEmail('').userEntersName('').userEntersPassword('')
        //         .userPressesRegisterButton();
        //     fixture.detectChanges();
        //
        //     page.addPageErrorElements();
        //     expect(page.nameError.nativeElement.textContent).toBe('Enter your name');
        //     expect(page.emailError.nativeElement.textContent).toBe('Enter your email address');
        //     expect(page.passwordError.nativeElement.textContent).toBe('Enter your password');
        //     expect(spy.calls.any()).toBeFalsy();
        // }));
        //
        // it('has password less than required length should display password error and not call AuthService CreateUser',
        //     inject([AUTH_SERVICE], (authService: AuthService) => {
        //         const spy = spyOn(authService, 'createNewUser');
        //
        //         page.userEntersEmail('email').userEntersName('name').userEntersPassword('12345')
        //             .userPressesRegisterButton();
        //         fixture.detectChanges();
        //
        //         page.addPageErrorElements();
        //         expect(page.passwordError.nativeElement.textContent).toBe('Password must be at least 6 characters long');
        //         expect(spy.calls.any()).toBeFalsy();
        // }));


    });




}
//endregion

//region Helpers
/** Create RegisterComponent, initialize it and set the test variables */
function createComponent(): Promise<void> {
    fixture = TestBed.createComponent(RegisterComponent);
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
    registerForm: DebugElement;
    nameInput: HTMLInputElement;
    emailInput: HTMLInputElement;
    passwordInput: HTMLInputElement;
    registerButton: DebugElement;
    logInButton: DebugElement;
    passwordError: DebugElement;
    emailError: DebugElement;
    nameError: DebugElement;

    public addPageElements(): void {
        this.formTitle = fixture.debugElement.query(By.css('.form-title')).nativeElement;
        this.registerForm = fixture.debugElement.query(By.css('.form-container'));
        this.nameInput = fixture.debugElement.query(By.css('#name')).nativeElement;
        this.emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
        this.passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;
        this.logInButton = fixture.debugElement.query(By.css('#login-button'));
        this.registerButton = fixture.debugElement.query(By.css('#register-button'));

    }

    public addPageErrorElements(): void {
        this.passwordError = fixture.debugElement.query(By.css('#password-error'));
        this.emailError = fixture.debugElement.query(By.css('#email-error'));
        this.nameError = fixture.debugElement.query(By.css('#name-error'));
    }

    userEntersName(name: string): Page {
        this.nameInput.value = name;
        this.nameInput.dispatchEvent(new Event('input'));
        return this;
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

    userPressesLogIn(): Page {
        this.logInButton.triggerEventHandler('click', null);
        return this;
    }

    userPressesRegisterButton(): Page {
        this.registerForm.triggerEventHandler('ngSubmit', this.registerForm);
        return this;
    }
}
//endregion


//

//

//
//     describe('calls createNewUser on AuthService', () => {
//         let authService: AuthServiceStub;
//         let createUserSpy: Spy;
//         let logInSpy: Spy;
//         const name = 'name';
//         const email = 'email';
//         const password = 'password';
//         let newUser: NewUser;
//         let user: User;
//
//         beforeEach(() => {
//             authService = fixture.debugElement.injector.get(AUTH_SERVICE);
//             createUserSpy = spyOn(authService, 'createNewUser').and.callThrough();
//             logInSpy = spyOn(authService, 'logIn');
//             newUser = {
//                 name: name,
//                 email: email,
//                 password: password
//             };
//             user = {
//                 name: name,
//                 email: email,
//                 uid: 'uid'
//             };
//         });
//
//         it('0 times if user has not set inputs and registers', () => {
//             registerPage
//                 .userEntersEmail('')
//                 .userEntersPassword('')
//                 .userEntersName('')
//                 .userPressesRegisterButton();
//             expect(createUserSpy.calls.any()).toEqual(false);
//         });
//
//         it('1 time if user has set inputs and registers', () => {
//             registerPage
//                 .userEntersEmail(email)
//                 .userEntersPassword(password)
//                 .userEntersName(name)
//                 .userPressesRegisterButton();
//             expect(createUserSpy).toHaveBeenCalledTimes(1);
//             expect(createUserSpy).toHaveBeenCalledWith(newUser);
//         });
//
//         it('and shows error if user entered invalid email', () => {
//             authService.setCreateUserError(CreateUserError.InvalidEmail);
//             registerPage
//                 .userEntersEmail(email)
//                 .userEntersPassword(password)
//                 .userEntersName(name)
//                 .userPressesRegisterButton();
//             fixture.detectChanges();
//             let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
//             expect(emailError.textContent).toBe('Enter a valid email address');
//             expect(registerPage.passwordInput.value).toBe('');
//         });
//
//         it('and shows error if user entered invalid password', () => {
//             authService.setCreateUserError(CreateUserError.WeakPassword);
//             registerPage
//                 .userEntersEmail(email)
//                 .userEntersPassword(password)
//                 .userEntersName(name)
//                 .userPressesRegisterButton();
//             fixture.detectChanges();
//             let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
//             expect(passwordError.textContent).toBe('Enter a stronger password');
//             expect(registerPage.passwordInput.value).toBe('');
//         });
//
//         //TODO
//         // describe('and navigates to', () => {
//         //     let router: RouterStub;
//         //     let routerSpy: Spy;
//         //     let activatedRoute: ActivatedRouteStub;
//         //
//         //     beforeEach(() => {
//         //         activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
//         //         router = fixture.debugElement.injector.get(Router);
//         //         routerSpy = spyOn(router, 'navigate').and.callThrough();
//         //     });
//         //
//         //     it('home when user successfully created', () => {
//         //         authService.setCreateUserResult(user);
//         //         registerPage
//         //             .userEntersEmail(email)
//         //             .userEntersPassword(password)
//         //             .userEntersName(name)
//         //             .userPressesRegisterButton();
//         //         expect(routerSpy).toHaveBeenCalledTimes(1);
//         //         expect(routerSpy).toHaveBeenCalledWith(['/home']);
//         //     });
//         //
//         //     it('error when user creation failed', () => {
//         //         authService.setCreateUserError(CreateUserError.Failed);
//         //         registerPage
//         //             .userEntersEmail(email)
//         //             .userEntersPassword(password)
//         //             .userEntersName(name)
//         //             .userPressesRegisterButton();
//         //         expect(routerSpy).toHaveBeenCalledTimes(1);
//         //         expect(routerSpy).toHaveBeenCalledWith(['/error']);
//         //     });
//         //
//         //     it('register review when user successfully created', () => {
//         //         authService.setCreateUserError(CreateUserError.EmailAlreadyRegistered);
//         //         registerPage
//         //             .userEntersEmail(email)
//         //             .userEntersPassword(password)
//         //             .userEntersName(name)
//         //             .userPressesRegisterButton();
//         //         expect(routerSpy).toHaveBeenCalledTimes(1);
//         //         expect(routerSpy).toHaveBeenCalledWith(['/register-review', email]);
//         //     });
//         //
//         //     it('log in when user presses log in button', () => {
//         //         registerPage.userPressesLogIn();
//         //         expect(routerSpy).toHaveBeenCalledTimes(1);
//         //         expect(routerSpy).toHaveBeenCalledWith(['login'], {relativeTo: activatedRoute.parent});
//         //     });
//         // });
//     });
// });
