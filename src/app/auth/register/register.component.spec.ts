import {DebugElement} from "@angular/core";
import {ComponentFixture, async, TestBed} from "@angular/core/testing";
import {RegisterComponent} from "./register.component";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {AUTH_SERVICE, CreateUserError, NewUser} from "../services/auth.service";
import {AuthServiceStub} from "../../testing/auth.service.stub";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivatedRouteStub, RouterStub} from "../../testing/router.stub";
import Spy = jasmine.Spy;
import {User} from "../user";

class RegisterPage {
    registerForm: DebugElement;
    nameInput: HTMLInputElement;
    emailInput: HTMLInputElement;
    passwordInput: HTMLInputElement;
    registerButton: DebugElement;
    logInButton: DebugElement;

    constructor(private fixture: ComponentFixture<RegisterComponent>){
        this.registerForm = fixture.debugElement.query(By.css('.form-container'));
        this.nameInput = fixture.debugElement.query(By.css('#name')).nativeElement;
        this.emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
        this.passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;
        this.logInButton = fixture.debugElement.query(By.css('#login-button'));
        this.registerButton = fixture.debugElement.query(By.css('#register-button'));
    }

    userEntersName(name: string): RegisterPage {
        this.nameInput.value = name;
        this.nameInput.dispatchEvent(new Event('input'));
        return this;
    }

    userEntersEmail(email: string): RegisterPage {
        this.emailInput.value = email;
        this.emailInput.dispatchEvent(new Event('input'));
        return this;
    }

    userEntersPassword(password: string): RegisterPage {
        this.passwordInput.value = password;
        this.passwordInput.dispatchEvent(new Event('input'));
        return this;
    }

    userPressesLogIn(): RegisterPage {
        this.logInButton.triggerEventHandler('click', null);
        return this;
    }

    userPressesRegisterButton(): RegisterPage {
        this.registerForm.triggerEventHandler('ngSubmit', this.registerForm);
        return this;
    }
}

describe('A RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let registerPage: RegisterPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [RegisterComponent],
            providers: [
                {provide: AUTH_SERVICE, useClass: AuthServiceStub},
                {provide: Router, useClass: RouterStub},
                {provide: ActivatedRoute, useClass: ActivatedRouteStub}
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        registerPage = new RegisterPage(fixture);
        fixture.detectChanges(); // calls ngOnInit
    });

    it('should have a title displaying "Create account"', () => {
        de = fixture.debugElement.query(By.css('.form-title'));
        el = de.nativeElement;
        expect(el.textContent).toContain('Create account');
    });

    it('should have a button displaying "Log in"', () => {
        expect(registerPage.logInButton.nativeElement.textContent).toContain('Log in');
    });

    it('should have a button displaying "Create your koffi account"', () => {
        expect(registerPage.registerButton.nativeElement.textContent).toContain('Create your koffi account');
    });

    it('should display errors when inputs not set and user registers', () => {
        registerPage
            .userEntersEmail('')
            .userEntersName('')
            .userEntersPassword('')
            .userPressesRegisterButton();
        fixture.detectChanges();

        let nameError = fixture.debugElement.query(By.css('#name-error')).nativeElement;
        expect(nameError.textContent).toBe('Enter your name');

        let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
        expect(emailError.textContent).toBe('Enter your email address');

        let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
        expect(passwordError.textContent).toBe('Enter your password');
    });

    it('should display error when password is less than required length and user registers', () => {
        registerPage
            .userEntersEmail('email')
            .userEntersName('name')
            .userEntersPassword('12345')
            .userPressesRegisterButton();
        fixture.detectChanges();

        let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
        expect(passwordError.textContent).toBe('Password must be at least 6 characters long');
    });

    describe('calls createNewUser on AuthService', () => {
        let authService: AuthServiceStub;
        let createUserSpy: Spy;
        let logInSpy: Spy;
        const name = 'name';
        const email = 'email';
        const password = 'password';
        let newUser: NewUser;
        let user: User;

        beforeEach(() => {
            authService = fixture.debugElement.injector.get(AUTH_SERVICE);
            createUserSpy = spyOn(authService, 'createNewUser').and.callThrough();
            logInSpy = spyOn(authService, 'logIn');
            newUser = {
                name: name,
                email: email,
                password: password
            };
            user = {
                name: name,
                email: email,
                uid: 'uid'
            };
        });

        it('0 times if user has not set inputs and registers', () => {
            registerPage
                .userEntersEmail('')
                .userEntersPassword('')
                .userEntersName('')
                .userPressesRegisterButton();
            expect(createUserSpy.calls.any()).toEqual(false);
        });

        it('1 time if user has set inputs and registers', () => {
            registerPage
                .userEntersEmail(email)
                .userEntersPassword(password)
                .userEntersName(name)
                .userPressesRegisterButton();
            expect(createUserSpy).toHaveBeenCalledTimes(1);
            expect(createUserSpy).toHaveBeenCalledWith(newUser);
        });

        it('and shows error if user entered invalid email', () => {
            authService.setCreateUserError(CreateUserError.InvalidEmail);
            registerPage
                .userEntersEmail(email)
                .userEntersPassword(password)
                .userEntersName(name)
                .userPressesRegisterButton();
            fixture.detectChanges();
            let emailError = fixture.debugElement.query(By.css('#email-error')).nativeElement;
            expect(emailError.textContent).toBe('Enter a valid email address');
            expect(registerPage.passwordInput.value).toBe('');
        });

        it('and shows error if user entered invalid password', () => {
            authService.setCreateUserError(CreateUserError.WeakPassword);
            registerPage
                .userEntersEmail(email)
                .userEntersPassword(password)
                .userEntersName(name)
                .userPressesRegisterButton();
            fixture.detectChanges();
            let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
            expect(passwordError.textContent).toBe('Enter a stronger password');
            expect(registerPage.passwordInput.value).toBe('');
        });

        //TODO
        // describe('and navigates to', () => {
        //     let router: RouterStub;
        //     let routerSpy: Spy;
        //     let activatedRoute: ActivatedRouteStub;
        //
        //     beforeEach(() => {
        //         activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        //         router = fixture.debugElement.injector.get(Router);
        //         routerSpy = spyOn(router, 'navigate').and.callThrough();
        //     });
        //
        //     it('home when user successfully created', () => {
        //         authService.setCreateUserResult(user);
        //         registerPage
        //             .userEntersEmail(email)
        //             .userEntersPassword(password)
        //             .userEntersName(name)
        //             .userPressesRegisterButton();
        //         expect(routerSpy).toHaveBeenCalledTimes(1);
        //         expect(routerSpy).toHaveBeenCalledWith(['/home']);
        //     });
        //
        //     it('error when user creation failed', () => {
        //         authService.setCreateUserError(CreateUserError.Failed);
        //         registerPage
        //             .userEntersEmail(email)
        //             .userEntersPassword(password)
        //             .userEntersName(name)
        //             .userPressesRegisterButton();
        //         expect(routerSpy).toHaveBeenCalledTimes(1);
        //         expect(routerSpy).toHaveBeenCalledWith(['/error']);
        //     });
        //
        //     it('register review when user successfully created', () => {
        //         authService.setCreateUserError(CreateUserError.EmailAlreadyRegistered);
        //         registerPage
        //             .userEntersEmail(email)
        //             .userEntersPassword(password)
        //             .userEntersName(name)
        //             .userPressesRegisterButton();
        //         expect(routerSpy).toHaveBeenCalledTimes(1);
        //         expect(routerSpy).toHaveBeenCalledWith(['/register-review', email]);
        //     });
        //
        //     it('log in when user presses log in button', () => {
        //         registerPage.userPressesLogIn();
        //         expect(routerSpy).toHaveBeenCalledTimes(1);
        //         expect(routerSpy).toHaveBeenCalledWith(['login'], {relativeTo: activatedRoute.parent});
        //     });
        // });
    });
});
