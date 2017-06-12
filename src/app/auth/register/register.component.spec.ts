import {DebugElement} from "@angular/core";
import {ComponentFixture, async, TestBed, inject} from "@angular/core/testing";
import {RegisterComponent} from "./register.component";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {AUTH_SERVICE, AuthService, Credentials, NewUserCredentials} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import Spy = jasmine.Spy;
import {MockAuthService} from "../testing/mock.auth.service";
import {MockRouter} from "../../testing/mock.router";
import {MockActivatedRoute} from "../../testing/mock.activated.route";
import {MockUser} from "../testing/mock.user";
import {Observable} from "rxjs/Observable";
import {EmailRegisteredError} from "../errors/email-registered.error";
import {InvalidEmailError} from "../errors/invalid-email.error";



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

function registerTests(): void {

        let expectEmailError = () => expect(page.emailError.nativeElement.textContent).toBe('Enter your email address');
        let expectNameError = () => expect(page.nameError.nativeElement.textContent).toBe('Enter your name');
        let expectPasswordError = () => expect(page.passwordError.nativeElement.textContent).toBe('Enter your password');

        it('with no email, password or name, should display errors and not call AuthService CreateUser',
            inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'createNewUser');

            page.userPressesRegisterButton();
            fixture.detectChanges();

            page.addPageErrorElements();
            expectNameError();
            expectEmailError();
            expectPasswordError();
            expect(spy.calls.any()).toBeFalsy();
        }));

        it('with email, but no password or name, should display errors and not call AuthService CreateUser',
            inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'createNewUser');

            page.userEntersEmail(MockUser.email).userPressesRegisterButton();
            fixture.detectChanges();

            page.addPageErrorElements();
            expectNameError();
            expectPasswordError();
            expect(spy.calls.any()).toBeFalsy();
        }));

        it('with name, but no email or password, should display errors and not call AuthService CreateUser',
            inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'createNewUser');

            page.userEntersName(MockUser.name).userPressesRegisterButton();
            fixture.detectChanges();

            page.addPageErrorElements();
            expectEmailError();
            expectPasswordError();
            expect(spy.calls.any()).toBeFalsy();
        }));

        it('with password, but no email or name, should display errors and not call AuthService CreateUser',
        inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'createNewUser');

            page.userEntersPassword("*******").userPressesRegisterButton();
            fixture.detectChanges();

            page.addPageErrorElements();
            expectEmailError();
            expectNameError();
            expect(spy.calls.any()).toBeFalsy();
        }));

        it('with name and email, but no password, should display errors and not call AuthService CreateUser',
            inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'createNewUser');

            page.userEntersEmail(MockUser.email).userEntersName(MockUser.name).userPressesRegisterButton();
            fixture.detectChanges();

            page.addPageErrorElements();
            expectPasswordError();
            expect(spy.calls.any()).toBeFalsy();
        }));

        it('with name and password, but no email, should display errors and not call AuthService CreateUser',
            inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'createNewUser');

            page.userEntersName(MockUser.name).userEntersPassword('******').userPressesRegisterButton();
            fixture.detectChanges();

            page.addPageErrorElements();
            expectEmailError();
            expect(spy.calls.any()).toBeFalsy();
        }));

        it('with email and password, but no name, should display errors and not call AuthService CreateUser',
            inject([AUTH_SERVICE], (authService: AuthService) => {
            const spy = spyOn(authService, 'createNewUser');

            page.userEntersEmail(MockUser.email).userEntersPassword('******').userPressesRegisterButton();
            fixture.detectChanges();

            page.addPageErrorElements();
            expectNameError();
            expect(spy.calls.any()).toBeFalsy();
        }));

        it('with password less than required length, should display password error and not call AuthService CreateUser',
            inject([AUTH_SERVICE], (authService: AuthService) => {
                const spy = spyOn(authService, 'createNewUser');

                page.userEntersEmail(MockUser.email).userEntersName(MockUser.name).userEntersPassword('12345')
                    .userPressesRegisterButton();
                fixture.detectChanges();

                page.addPageErrorElements();
                expect(page.passwordError.nativeElement.textContent).toBe('Password must be at least 6 characters long');
                expect(spy.calls.any()).toBeFalsy();
        }));

        describe('with name, email and password', () => {
            let credentials: NewUserCredentials = { email: MockUser.email, name: MockUser.name, password: "******" };

            it('should navigate to home when AuthService createNewUser successfully returns',
                inject([AUTH_SERVICE, Router, ActivatedRoute],
                    (authService: AuthService, router: Router, route: ActivatedRoute) => {
                    const spyAuthService = spyOn(authService, 'createNewUser')
                        .and.returnValue(Observable.create(obs => obs.next(MockUser)));
                    const spyRouter = spyOn(router, 'navigate');
                    spyOnProperty(route, 'root', 'get').and.returnValue("root");

                    page.userEntersEmail(credentials.email).userEntersName(MockUser.name)
                        .userEntersPassword(credentials.password).userPressesRegisterButton();
                    fixture.detectChanges();

                    expect(spyAuthService).toHaveBeenCalledWith(credentials);
                    expect(spyRouter).toHaveBeenCalledWith(['home'], {relativeTo: "root"});
            }));

            it('should navigate to register-review when AuthService createNewUser returns EmailRegisteredError',
                inject([AUTH_SERVICE, Router, ActivatedRoute],
                    (authService: AuthService, router: Router, route: ActivatedRoute) => {
                    const spyAuthService = spyOn(authService, 'createNewUser')
                        .and.returnValue(Observable.create(obs => obs.error(new EmailRegisteredError())));
                    const spyRouter = spyOn(router, 'navigate');
                    spyOnProperty(route, 'parent', 'get').and.returnValue("parent");

                    page.userEntersEmail(credentials.email).userEntersName(MockUser.name)
                        .userEntersPassword(credentials.password).userPressesRegisterButton();
                    fixture.detectChanges();

                    expect(spyAuthService).toHaveBeenCalledWith(credentials);
                    expect(spyRouter).toHaveBeenCalledWith(['register-review', credentials.email],
                        {relativeTo: "parent"});
            }));

            it('should display email error when AuthService createNewUser returns InvalidEmailError',
                inject([AUTH_SERVICE], (authService: AuthService) => {
                    const spyAuthService = spyOn(authService, 'createNewUser')
                        .and.returnValue(Observable.create(obs => obs.error(new InvalidEmailError())));

                    page.userEntersEmail(credentials.email).userEntersName(MockUser.name)
                        .userEntersPassword(credentials.password).userPressesRegisterButton();
                    fixture.detectChanges();

                    page.addPageErrorElements();
                    expect(spyAuthService).toHaveBeenCalledWith(credentials);
                    expect(page.formError.nativeElement.textContent).toBe('Enter a valid email address');

                }));


        });



        it('with password, email and name, and ')
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
    formError: DebugElement;

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
        this.formError = fixture.debugElement.query(By.css('#form-error'));
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
