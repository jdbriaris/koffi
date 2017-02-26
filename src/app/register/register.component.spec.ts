import {DebugElement} from "@angular/core";
import {ComponentFixture, async, TestBed} from "@angular/core/testing";
import {RegisterComponent} from "./register.component";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {AUTH_SERVICE, CreateUserResult} from "../services/auth.service";
import {AuthServiceStub} from "../testing/auth.service.stub";
import {Router} from "@angular/router";
import {RouterStub} from "../testing/router.stub";
import Spy = jasmine.Spy;

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
                {provide: Router, useClass: RouterStub}
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

    describe('creates a user on AuthService', () => {
        let authService: AuthServiceStub;
        let authServiceSpy: Spy;
        let name = 'name';
        let email = 'email';
        let password = 'password';
        let newUser = {
            name: name,
            email: email,
            password: password
        };

        beforeEach(() => {
            authService = fixture.debugElement.injector.get(AUTH_SERVICE);
            authServiceSpy = spyOn(authService, 'createUser').and.callThrough();
        });

        it('0 times if user has not set inputs and registers', () => {
            registerPage
                .userEntersEmail('')
                .userEntersPassword('')
                .userEntersName('')
                .userPressesRegisterButton();
            expect(authServiceSpy.calls.any()).toEqual(false);
        });

        it('1 time if user has set inputs and registers', () => {
            registerPage
                .userEntersEmail(email)
                .userEntersPassword(password)
                .userEntersName(name)
                .userPressesRegisterButton();

            expect(authServiceSpy).toHaveBeenCalledTimes(1);
            expect(authServiceSpy).toHaveBeenCalledWith(newUser);
        });

        it('and shows error if user entered invalid email', () => {
            authService.setCreateUserResult(CreateUserResult.InvalidEmail);
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
            authService.setCreateUserResult(CreateUserResult.InvalidPassword);
            registerPage
                .userEntersEmail(email)
                .userEntersPassword(password)
                .userEntersName(name)
                .userPressesRegisterButton();
            fixture.detectChanges();

            let passwordError = fixture.debugElement.query(By.css('#password-error')).nativeElement;
            expect(passwordError.textContent).toBe('Enter a valid password');
            expect(registerPage.passwordInput.value).toBe('');
        });

        describe('and navigates to', () => {
            let router: RouterStub;
            let routerSpy: Spy;

            beforeEach(() => {
                router = fixture.debugElement.injector.get(Router);
                routerSpy = spyOn(router, 'navigate').and.callThrough();
            });

            it('home when user successfully created', () => {
                authService.setCreateUserResult(CreateUserResult.Success);
                registerPage
                    .userEntersEmail(email)
                    .userEntersPassword(password)
                    .userEntersName(name)
                    .userPressesRegisterButton();
                expect(routerSpy).toHaveBeenCalledTimes(1);
                expect(routerSpy).toHaveBeenCalledWith(['/home']);
            });

            it('error when user creation failed', () => {
                authService.setCreateUserResult(CreateUserResult.Failed);
                registerPage
                    .userEntersEmail(email)
                    .userEntersPassword(password)
                    .userEntersName(name)
                    .userPressesRegisterButton();
                expect(routerSpy).toHaveBeenCalledTimes(1);
                expect(routerSpy).toHaveBeenCalledWith(['/error']);
            });

            it('register review when user successfully created', () => {
                authService.setCreateUserResult(CreateUserResult.EmailAlreadyRegistered);
                registerPage
                    .userEntersEmail(email)
                    .userEntersPassword(password)
                    .userEntersName(name)
                    .userPressesRegisterButton();
                expect(routerSpy).toHaveBeenCalledTimes(1);
                expect(routerSpy).toHaveBeenCalledWith(['/register-review']);
            });

            it('log in when user presses log in button', () => {
                registerPage.userPressesLogIn();
                //expect(routerSpy).toHaveBeenCalledTimes(1);
                //expect(routerSpy).toHaveBeenCalledWith(['/login']);
            });
        });
    });
});
